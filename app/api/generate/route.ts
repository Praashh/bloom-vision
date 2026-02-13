import { NextResponse } from 'next/server';
import Firecrawl from '@mendable/firecrawl-js';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { prisma } from '@/db';

const firecrawl = new Firecrawl({
    apiKey: process.env.FIRECRAWLER_API_KEY as string
});

const MODELID = process.env.NEXT_PUBLIC_MODELID as string;
const GENERATION_API = process.env.GENERATION_API as string;


export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userCredits = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        select: {
            credit: true
        }
    })
    if (userCredits!.credit <= 0) {
        return NextResponse.json({ error: 'No credits left' }, { status: 400 });
    }
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        console.log('Scraping URL:', url);

        const extractResult = await firecrawl.extract({
            urls: [url],
            prompt: "Analyze the theme of this website and generate a highly detailed image prompt for a marketing image.",
            schema: {
                type: "object",
                properties: {
                    company_name: { type: "string" },
                    brand_colors: { type: "string" },
                    visual_style: { type: "string" },
                    description: { type: "string" },
                    suggested_image_prompt: {
                        type: "string",
                        description: "A highly detailed prompt for a high-quality marketing image that represents the brand's theme and purpose. Mention colors, mood, and objects."
                    }
                },
                required: ["company_name", "suggested_image_prompt"]
            }
        });

        if (!extractResult.success) {
            throw new Error(`Failed to extract website theme: ${extractResult.error}`);
        }

        const brandData = extractResult.data as {
            company_name: string;
            brand_colors: string;
            visual_style: string;
            description: string;
            suggested_image_prompt: string;
        };
        const prompt = brandData?.suggested_image_prompt;

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
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
