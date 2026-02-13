import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { prisma } from '@/db';

export async function GET() {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ images: [] });
    }

    const user = session.user;
    try {
        const generation = await prisma.generations.findMany({
            where: {
                userId: user.id
            }
        })
        const assetIds = generation.map(g => g.assetId);

        const images = await Promise.all(assetIds.map(async (assetId) => {
            const { data, error: signedError } = await supabase.storage
                .from('assets')
                .createSignedUrl(assetId, 31536000);

            if (signedError) {
                console.error(`Error signing URL for ${assetId}:`, signedError);
                return null;
            }

            return {
                url: data.signedUrl,
                name: assetId,
                time: new Date().getTime()
            };
        }));

        const validImages = images.filter(img => img !== null);

        return NextResponse.json({ images: validImages });
    } catch (error) {
        console.error('Error listing images:', error);
        return NextResponse.json({ images: [] });
    }
}
