import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Video, Sparkles, Play } from 'lucide-react';

interface VideoGenerationResponse {
  success: boolean;
  taskId: string;
  videoPath: string;
  videoUrl: string;
  hdVideoUrl: string | null;
  message: string;
  completeTime: number;
}

const VideoGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    prompt: '',
    model: 'veo3_fast',
    aspectRatio: '16:9',
    filename: 'generated_video.mp4'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<VideoGenerationResponse | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.prompt.trim()) {
      toast.error('Please enter a video prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: VideoGenerationResponse = await response.json();
      
      if (result.success) {
        setGeneratedVideo(result);
        toast.success(result.message || 'Video generated successfully!');
      } else {
        throw new Error('Video generation failed');
      }
    } catch (error) {
      console.error('Video generation error:', error);
      toast.error('Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Video className="w-12 h-12 text-primary animate-pulse-neon" />
          <h1 className="text-5xl font-bold bg-gradient-neon bg-clip-text text-transparent">
            AI Video Studio
          </h1>
          <Sparkles className="w-12 h-12 text-accent animate-glow-rotate" />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your imagination into stunning videos with cutting-edge AI technology
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generation Form */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-neon">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center space-x-2">
              <Sparkles className="w-6 h-6" />
              <span>Create Your Video</span>
            </CardTitle>
            <CardDescription>
              Enter your creative prompt and let AI bring your vision to life
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-foreground font-medium">
                Video Prompt *
              </Label>
              <Textarea
                id="prompt"
                placeholder="Describe the video you want to create... (e.g., A person walking forward with confident steps in a neon-lit city)"
                value={formData.prompt}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                className="min-h-[100px] bg-muted/50 border-primary/30 focus:border-primary focus:shadow-neon/50 transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model" className="text-foreground font-medium">
                  AI Model
                </Label>
                <Select value={formData.model} onValueChange={(value) => handleInputChange('model', value)}>
                  <SelectTrigger className="bg-muted/50 border-primary/30 focus:border-primary focus:shadow-neon/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-primary/30">
                    <SelectItem value="veo3_fast">Veo3 Fast</SelectItem>
                    <SelectItem value="veo3_premium">Veo3 Premium</SelectItem>
                    <SelectItem value="runway_gen3">Runway Gen-3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aspectRatio" className="text-foreground font-medium">
                  Aspect Ratio
                </Label>
                <Select value={formData.aspectRatio} onValueChange={(value) => handleInputChange('aspectRatio', value)}>
                  <SelectTrigger className="bg-muted/50 border-primary/30 focus:border-primary focus:shadow-neon/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-primary/30">
                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filename" className="text-foreground font-medium">
                Filename
              </Label>
              <Input
                id="filename"
                placeholder="your_video.mp4"
                value={formData.filename}
                onChange={(e) => handleInputChange('filename', e.target.value)}
                className="bg-muted/50 border-primary/30 focus:border-primary focus:shadow-neon/50 transition-all duration-300"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.prompt.trim()}
              variant="neon"
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5 mr-2" />
                  Generate Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Video Display */}
        <Card className="border-accent/20 bg-card/50 backdrop-blur-sm shadow-cyan">
          <CardHeader>
            <CardTitle className="text-2xl text-accent flex items-center space-x-2">
              <Play className="w-6 h-6" />
              <span>Generated Video</span>
            </CardTitle>
            <CardDescription>
              Your AI-generated masterpiece will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedVideo ? (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden shadow-intense">
                  <video
                    controls
                    className="w-full h-auto max-h-96 bg-black"
                    poster="/placeholder-video.jpg"
                  >
                    <source src={generatedVideo.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-accent/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Task ID:</span>
                    <code className="text-xs bg-primary/20 px-2 py-1 rounded text-primary font-mono">
                      {generatedVideo.taskId}
                    </code>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Generated:</span>
                    <span className="text-sm text-foreground">
                      {new Date(generatedVideo.completeTime).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => window.open(generatedVideo.videoUrl, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Open Video
                    </Button>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedVideo.videoUrl);
                        toast.success('Video URL copied to clipboard!');
                      }}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      Copy URL
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 border-2 border-dashed border-accent/30 rounded-lg">
                <Video className="w-16 h-16 text-accent/50" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-muted-foreground">
                    No video generated yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Create your first AI video using the form on the left
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoGenerator;