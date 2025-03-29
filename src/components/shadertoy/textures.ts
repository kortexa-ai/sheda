/**
 * Texture handling functions for ShaderToy
 * 
 * NOTE: This file contains the texture loading logic, but it's currently not being used
 * due to React Native compatibility issues. It's kept here for future implementation.
 */

import { Texture, TextureLoader } from 'three';

// Interface for texture properties
export interface TextureProps {
  url: string;                  // URL of the texture
  wrapS?: number;               // Wrapping mode for S (horizontal)
  wrapT?: number;               // Wrapping mode for T (vertical)
  minFilter?: number;           // Minification filter
  magFilter?: number;           // Magnification filter
  flipY?: boolean;              // Whether to flip the texture vertically
}

/**
 * Load a single texture from URL
 */
export function loadTexture(texture: TextureProps): Promise<Texture | null> {
  return new Promise<Texture | null>((resolve) => {
    if (!texture.url) {
      resolve(null);
      return;
    }
    
    // Create a texture loader
    const loader = new TextureLoader();
    
    // Load the texture
    loader.load(
      texture.url,
      // On success
      (loadedTexture) => {
        // Apply texture properties
        if (texture.wrapS) loadedTexture.wrapS = texture.wrapS;
        if (texture.wrapT) loadedTexture.wrapT = texture.wrapT;
        if (texture.minFilter) loadedTexture.minFilter = texture.minFilter;
        if (texture.magFilter) loadedTexture.magFilter = texture.magFilter;
        if (texture.flipY !== undefined) loadedTexture.flipY = texture.flipY;
        
        resolve(loadedTexture);
      },
      // On progress - not handling
      undefined,
      // On error
      () => {
        console.warn(`Failed to load texture: ${texture.url}`);
        resolve(null);
      }
    );
  });
}

/**
 * Load multiple textures and return them as an array
 */
export function loadTextures(textures: TextureProps[]): Promise<(Texture | null)[]> {
  if (!textures || textures.length === 0) {
    return Promise.resolve([]);
  }
  
  // Create promises for each texture
  const texturePromises = textures.map(texture => loadTexture(texture));
  
  // Wait for all textures to load
  return Promise.all(texturePromises);
}

/**
 * Create texture uniforms for a shader
 */
export function createTextureUniforms(
  loadedTextures: (Texture | null)[],
  shaderCode: string,
  channelPrefix: string = 'iChannel',
  resolutionUniform: string = 'iChannelResolution'
): Record<string, any> {
  const uniformsObj: Record<string, any> = {};
  
  if (loadedTextures.length === 0) {
    return uniformsObj;
  }
  
  // Add individual texture channels
  loadedTextures.forEach((texture, index) => {
    const channelName = `${channelPrefix}${index}`;
    if (shaderCode.includes(channelName)) {
      uniformsObj[channelName] = { value: texture };
    }
  });
  
  // Add channel resolution information
  if (shaderCode.includes(resolutionUniform)) {
    const resolutions: number[] = [];
    loadedTextures.forEach((texture, index) => {
      if (texture) {
        // Get the image dimensions
        resolutions[index * 3] = texture.image.width;
        resolutions[index * 3 + 1] = texture.image.height;
        resolutions[index * 3 + 2] = 1; // Depth is 1 for 2D textures
      } else {
        // Placeholder values for missing textures
        resolutions[index * 3] = 0;
        resolutions[index * 3 + 1] = 0;
        resolutions[index * 3 + 2] = 0;
      }
    });
    uniformsObj[resolutionUniform] = { value: resolutions };
  }
  
  return uniformsObj;
}

/**
 * Clean up textures by disposing them
 */
export function disposeTextures(textures: (Texture | null)[]) {
  textures.forEach(texture => {
    if (texture) texture.dispose();
  });
}