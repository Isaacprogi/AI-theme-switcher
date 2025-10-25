import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_APP_GROQ_API_KEY;

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export class GroqThemeService {
  static async generateTheme(prompt: string): Promise<ColorPalette> {
    try {
      if (!GROQ_API_KEY) {
        throw new Error('Groq API key is not configured');
      }

      const systemPrompt = `You are a professional UI/UX designer and color theory expert. Generate a harmonious color palette in JSON format with exactly these keys: primary, secondary, accent, background, text. 
      
      Guidelines:
      - Return ONLY valid JSON, no additional text or markdown
      - Colors must be in hex format (#RRGGBB)
      - Primary color should be the main brand color
      - Secondary color should complement the primary
      - Accent color should provide contrast
      - Background should be light or dark based on theme
      - Text color should have good contrast with background
      - All colors should work well together and match the theme: "${prompt}"
      
      Example format: {"primary":"#3B82F6","secondary":"#1E40AF","accent":"#10B981","background":"#FFFFFF","text":"#1F2937"}`;

      const response = await axios.post(GROQ_API_URL, {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Generate a color palette for: ${prompt}`
          }
        ],
        temperature: 0.8,
        max_tokens: 200,
        top_p: 1,
        stream: false
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('Groq API Response:', response.data);

      if (!response.data.choices || !response.data.choices[0]?.message?.content) {
        throw new Error("Invalid response format from Groq API");
      }

      const content = response.data.choices[0].message.content;
      
      // Clean the response - remove any markdown code blocks and trim
      const cleanedContent = content.replace(/```json|```/g, '').trim();
      
      console.log('Cleaned AI Response:', cleanedContent);

      const palette = JSON.parse(cleanedContent);
      
      return this.validatePalette(palette);
      
    } catch (error) {
      console.error("Error generating theme with Groq:", error);
      
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      
      return this.getFallbackPalette();
    }
  }

  private static validatePalette(palette: any): ColorPalette {
    const requiredKeys = ['primary', 'secondary', 'accent', 'background', 'text'];
    
    // Check if all required keys are present
    for (const key of requiredKeys) {
      if (!(key in palette)) {
        console.warn(`Missing key in palette: ${key}`);
        return this.getFallbackPalette();
      }
      
      if (!this.isValidHexColor(palette[key])) {
        console.warn(`Invalid hex color for ${key}: ${palette[key]}`);
        return this.getFallbackPalette();
      }
    }
    
    // Additional validation: check contrast between background and text
    const background = palette.background;
    const text = palette.text;
    if (!this.hasSufficientContrast(background, text)) {
      console.warn('Insufficient contrast between background and text colors');
      // Adjust text color for better contrast
      palette.text = this.adjustTextColorForContrast(background);
    }
    
    return palette as ColorPalette;
  }

  private static isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  private static hasSufficientContrast(background: string, text: string): boolean {
    // Simple contrast check - in a real app, you might want to use a more sophisticated algorithm
    const bg = this.hexToRgb(background);
    const txt = this.hexToRgb(text);
    
    if (!bg || !txt) return true; // Fallback to true if conversion fails
    
    // Calculate relative luminance (simplified)
    const bgLuminance = this.getRelativeLuminance(bg);
    const textLuminance = this.getRelativeLuminance(txt);
    
    const contrast = Math.max(bgLuminance, textLuminance) / Math.min(bgLuminance, textLuminance);
    
    return contrast > 1.5; // Minimum contrast ratio
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private static getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private static adjustTextColorForContrast(background: string): string {
    const rgb = this.hexToRgb(background);
    if (!rgb) return '#1F2937'; // Default dark color
    
    // Simple adjustment: if background is light, use dark text; if dark, use light text
    const luminance = this.getRelativeLuminance(rgb);
    return luminance > 0.5 ? '#1F2937' : '#FFFFFF';
  }

  private static getFallbackPalette(): ColorPalette {
    return {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937'
    };
  }

  // Optional: Generate multiple theme variations
  static async generateThemeVariations(basePrompt: string, count: number = 3): Promise<ColorPalette[]> {
    const variations: ColorPalette[] = [];
    
    for (let i = 0; i < count; i++) {
      const variationPrompt = `${basePrompt} - variation ${i + 1}`;
      try {
        const theme = await this.generateTheme(variationPrompt);
        variations.push(theme);
      } catch (error) {
        console.error(`Failed to generate variation ${i + 1}:`, error);
        variations.push(this.getFallbackPalette());
      }
    }
    
    return variations;
  }
}