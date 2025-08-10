
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiClient } from '@/services/api';

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  channel: z.enum(['google', 'meta', 'youtube', 'tiktok']),
  budget: z.number().min(1, 'Budget must be greater than 0'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  locations: z.array(z.string()).min(1, 'At least one location is required'),
  demographics: z.array(z.string()).min(1, 'At least one demographic is required'),
  interests: z.array(z.string()).min(1, 'At least one interest is required'),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignCreateFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const CampaignCreateForm = ({ onBack, onSuccess }: CampaignCreateFormProps) => {
  const [locations, setLocations] = useState<string[]>([]);
  const [demographics, setDemographics] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [newDemographic, setNewDemographic] = useState('');
  const [newInterest, setNewInterest] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      channel: 'google',
      budget: 1000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      locations: [],
      demographics: [],
      interests: [],
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: (data: any) => ApiClient.createCampaign(data),
    onSuccess: () => {
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "There was an error creating your campaign.",
        variant: "destructive"
      });
    },
  });

  const addItem = (type: 'location' | 'demographic' | 'interest', value: string) => {
    if (!value.trim()) return;
    
    switch (type) {
      case 'location':
        if (!locations.includes(value)) {
          const newLocations = [...locations, value];
          setLocations(newLocations);
          form.setValue('locations', newLocations);
          setNewLocation('');
        }
        break;
      case 'demographic':
        if (!demographics.includes(value)) {
          const newDemographics = [...demographics, value];
          setDemographics(newDemographics);
          form.setValue('demographics', newDemographics);
          setNewDemographic('');
        }
        break;
      case 'interest':
        if (!interests.includes(value)) {
          const newInterests = [...interests, value];
          setInterests(newInterests);
          form.setValue('interests', newInterests);
          setNewInterest('');
        }
        break;
    }
  };

  const removeItem = (type: 'location' | 'demographic' | 'interest', value: string) => {
    switch (type) {
      case 'location':
        const newLocations = locations.filter(l => l !== value);
        setLocations(newLocations);
        form.setValue('locations', newLocations);
        break;
      case 'demographic':
        const newDemographics = demographics.filter(d => d !== value);
        setDemographics(newDemographics);
        form.setValue('demographics', newDemographics);
        break;
      case 'interest':
        const newInterests = interests.filter(i => i !== value);
        setInterests(newInterests);
        form.setValue('interests', newInterests);
        break;
    }
  };

  const onSubmit = (data: CampaignFormData) => {
    const campaignData = {
      ...data,
      targeting: {
        locations: data.locations,
        demographics: data.demographics,
        interests: data.interests,
      },
    };
    
    createCampaignMutation.mutate(campaignData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
        <h1 className="text-2xl font-bold">Create New Campaign</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter campaign name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="google">Google Ads</SelectItem>
                          <SelectItem value="meta">Meta Ads</SelectItem>
                          <SelectItem value="youtube">YouTube Ads</SelectItem>
                          <SelectItem value="tiktok">TikTok Ads</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1000"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Targeting Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Locations */}
              <div className="space-y-3">
                <Label>Geographic Locations</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add location (e.g., New York, NY)"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem('location', newLocation);
                      }
                    }}
                  />
                  <Button type="button" onClick={() => addItem('location', newLocation)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {locations.map((location) => (
                    <Badge key={location} variant="secondary" className="flex items-center gap-1">
                      {location}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeItem('location', location)}
                      />
                    </Badge>
                  ))}
                </div>
                {form.formState.errors.locations && (
                  <p className="text-sm text-destructive">{form.formState.errors.locations.message}</p>
                )}
              </div>

              {/* Demographics */}
              <div className="space-y-3">
                <Label>Target Demographics</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add demographic (e.g., Business Owners)"
                    value={newDemographic}
                    onChange={(e) => setNewDemographic(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem('demographic', newDemographic);
                      }
                    }}
                  />
                  <Button type="button" onClick={() => addItem('demographic', newDemographic)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {demographics.map((demographic) => (
                    <Badge key={demographic} variant="secondary" className="flex items-center gap-1">
                      {demographic}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeItem('demographic', demographic)}
                      />
                    </Badge>
                  ))}
                </div>
                {form.formState.errors.demographics && (
                  <p className="text-sm text-destructive">{form.formState.errors.demographics.message}</p>
                )}
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label>Interest Targeting</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add interest (e.g., Digital Marketing)"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem('interest', newInterest);
                      }
                    }}
                  />
                  <Button type="button" onClick={() => addItem('interest', newInterest)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                      {interest}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeItem('interest', interest)}
                      />
                    </Badge>
                  ))}
                </div>
                {form.formState.errors.interests && (
                  <p className="text-sm text-destructive">{form.formState.errors.interests.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={createCampaignMutation.isPending}>
              {createCampaignMutation.isPending ? 'Creating...' : 'Create Campaign'}
            </Button>
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CampaignCreateForm;
