import { NextResponse } from 'next/server';
import { DeepcrawlApp } from 'deepcrawl';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { prisma } from '@/db';

const client = new DeepcrawlApp({
    apiKey: process.env.DEEPCRAWLER_API_KEY!,
});

const MODELID = process.env.NEXT_PUBLIC_MODELID as string;
const GENERATION_API = process.env.GENERATION_API as string;


export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let deductResult: { count: number };

    try {
        deductResult = await prisma.user.updateMany({
            where: {
                id: session.user.id
            },
            data: {
                credit: {
                    decrement: 1
                }
            }
        });
    } catch (error) {
        console.error("[Generate] Credit deduction DB error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
    if (deductResult.count === 0) {
        return NextResponse.json(
            { error: "Insufficient Credits" },
            { status: 400 }
        )
    }
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        console.log('Scraping URL:', url);

        const readResult = await client.readUrl(url, {
            markdown: true,
            metadata: true,
        });

        if (!readResult.success) {
            throw new Error(`Failed to extract website theme: ${readResult.error}`);
        }

        const pageMarkdown = readResult.markdown || '';
        const pageTitle = readResult.metadata?.title || readResult.title || '';
        const pageDescription = readResult.metadata?.description || readResult.description || '';

        const brandData = {
            company_name: pageTitle,
            core_product_or_service: pageDescription,
            main_slogan_or_heading: pageTitle,
            target_audience: '',
            brand_colors: '',
            visual_style_and_tone: '',
            key_visual_elements: [] as string[],
            suggested_image_prompt: '',
        };

        // Build a detailed image generation prompt from the scraped page content
        const prompt = `A highly detailed, hyper-realistic professional marketing banner for "${pageTitle}". ${pageDescription ? `The brand is about: ${pageDescription}.` : ''} The design should prominently display the text "${pageTitle}" in bold, modern typography. Use a premium, polished aesthetic with cinematic lighting, elegant composition, and high-end photographic details. The visual style should match the brand's tone conveyed by the website content. Make it look like a world-class advertising campaign visual. Website context for reference: ${pageMarkdown.slice(0, 500)}`;
        brandData.suggested_image_prompt = prompt;

        if (!prompt) {
            throw new Error('Could not generate an image prompt from the website theme.');
        }

        console.log('Extracted Theme:', brandData);
        console.log('Generated Prompt:', prompt);

        const response = await fetch(GENERATION_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODELID,
                prompt: prompt,
                img_count: 1,
                size: "1:1",
                resType: "url"
            }),
        });

        const data = await response.json();

        if (!data.success) {
            console.error('API Error:', data);
            return NextResponse.json({ error: 'Failed to generate image', details: data }, { status: 500 });
        }

        const imageUrl = data.img_urls[0];
        const imageResponse = await fetch(imageUrl);

        if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image from ${imageUrl}`);
        }

        const buffer = await imageResponse.arrayBuffer();
        const fileName = `gen-${Date.now()}.png`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('assets')
            .upload(fileName, buffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (uploadError) {
            console.error('Supabase Upload Error:', uploadError);
            return NextResponse.json({
                success: true,
                imageUrl: `/generations/${fileName}`,
                taskId: data.taskId,
                timeTaken: data.time_taken,
                brandInfo: brandData,
                storage: 'local (supabase failed)'
            });
        }

        const generation = await prisma.generations.create({
            data: {
                websiteUrl: url,
                prompt: prompt,
                assetId: uploadData?.path,
                mimeType: "image/png",
                userId: session.user.id
            }
        });

        if (!generation) {
            console.error('Failed to create generation record');
            return NextResponse.json({ error: 'Failed to create generation record' }, { status: 500 });
        }

        const { data: signedData, error: signedError } = await supabase.storage
            .from('assets')
            .createSignedUrl(fileName, 31536000);

        if (signedError) {
            console.error('Error creating signed URL:', signedError);
            throw new Error(`Failed to create signed URL: ${signedError.message}`);
        }

        return NextResponse.json({
            success: true,
            imageUrl: signedData.signedUrl,
            taskId: data.taskId,
            timeTaken: data.time_taken,
            brandInfo: brandData,
            storage: 'supabase'
        });

    } catch (error: unknown) {
        console.error('Error in /api/generate:', error);

        try {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { credit: { increment: 1 } },
            });
        } catch (refundError) {
            console.error(
                "[Generate] CRITICAL: failed to refund credit for user",
                session.user.id,
                refundError
            );
        }
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
