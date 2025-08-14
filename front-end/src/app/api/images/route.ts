import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const imagesDirectory = join(process.cwd(), 'public', 'images');
    const filenames = await readdir(imagesDirectory);
    
    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const imageFiles = filenames
      .filter(name => imageExtensions.some(ext => name.toLowerCase().endsWith(ext)))
      .map(name => `/images/${name}`)
      .sort();
    
    return NextResponse.json(imageFiles);
  } catch (error) {
    console.error('Error reading images directory:', error);
    return NextResponse.json([], { status: 500 });
  }
}
