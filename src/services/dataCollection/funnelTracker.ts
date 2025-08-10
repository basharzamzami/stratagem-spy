
import { supabase } from "@/integrations/supabase/client";

export interface FunnelEvent {
  id: string;
  sessionId: string;
  userId?: string;
  eventType: 'page_view' | 'form_submit' | 'button_click' | 'scroll' | 'exit';
  eventData: Record<string, any>;
  timestamp: string;
  url: string;
  referrer?: string;
  userAgent: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

export interface FunnelStep {
  id: string;
  name: string;
  url: string;
  order: number;
  isGoal: boolean;
  conversionEvents: string[];
}

export interface FunnelSession {
  id: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  completedSteps: string[];
  conversionValue?: number;
  source: string;
  medium: string;
  campaign?: string;
}

export interface ConversionPath {
  sessionId: string;
  path: string[];
  timeToConversion: number;
  touchpoints: number;
  converted: boolean;
  dropOffStep?: string;
}

export class FunnelTracker {
  private static instance: FunnelTracker;
  private activeSession: string | null = null;
  private eventQueue: FunnelEvent[] = [];
  private isTracking = false;

  public static getInstance(): FunnelTracker {
    if (!FunnelTracker.instance) {
      FunnelTracker.instance = new FunnelTracker();
    }
    return FunnelTracker.instance;
  }

  async startTracking(funnelId: string, userId?: string): Promise<string> {
    console.log(`🎯 Starting funnel tracking for: ${funnelId}`);
    
    this.activeSession = this.generateSessionId();
    this.isTracking = true;

    // Initialize session in database
    await this.createSession({
      id: this.activeSession,
      userId,
      startTime: new Date().toISOString(),
      completedSteps: [],
      source: document.referrer || 'direct',
      medium: 'web',
      campaign: this.getCampaignFromUrl()
    });

    // Track initial page view
    await this.trackEvent({
      eventType: 'page_view',
      eventData: {
        funnelId,
        step: 'entry',
        title: document.title
      }
    });

    // Set up automatic event listeners
    this.setupEventListeners();

    return this.activeSession;
  }

  async trackEvent(event: Partial<FunnelEvent>): Promise<void> {
    if (!this.isTracking || !this.activeSession) return;

    const fullEvent: FunnelEvent = {
      id: this.generateEventId(),
      sessionId: this.activeSession,
      eventType: event.eventType || 'page_view',
      eventData: event.eventData || {},
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      deviceType: this.getDeviceType(),
      ...event
    };

    // Add to queue for batch processing
    this.eventQueue.push(fullEvent);

    // Process queue if it gets too large
    if (this.eventQueue.length >= 10) {
      await this.flushEventQueue();
    }

    console.log('🔍 Tracked event:', fullEvent.eventType, fullEvent.eventData);
  }

  async trackConversion(conversionValue?: number, conversionData?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventType: 'form_submit',
      eventData: {
        isConversion: true,
        conversionValue,
        conversionData,
        step: 'conversion'
      }
    });

    if (this.activeSession) {
      await this.updateSession(this.activeSession, {
        conversionValue,
        endTime: new Date().toISOString()
      });
    }

    console.log('🎉 Conversion tracked:', conversionValue);
  }

  async analyzeFunnelPerformance(funnelId: string, timeRange: { from: string; to: string }): Promise<{
    totalSessions: number;
    conversions: number;
    conversionRate: number;
    stepAnalysis: StepAnalysis[];
    topPaths: ConversionPath[];
    dropOffPoints: DropOffAnalysis[];
  }> {
    console.log('📊 Analyzing funnel performance:', funnelId);

    // Simulate analysis with mock data
    await this.delay(1500);

    const mockAnalysis = {
      totalSessions: Math.floor(Math.random() * 10000) + 1000,
      conversions: Math.floor(Math.random() * 500) + 50,
      conversionRate: Math.random() * 0.15 + 0.02, // 2-17%
      stepAnalysis: await this.generateStepAnalysis(),
      topPaths: await this.generateTopPaths(),
      dropOffPoints: await this.generateDropOffAnalysis()
    };

    mockAnalysis.conversionRate = mockAnalysis.conversions / mockAnalysis.totalSessions;

    return mockAnalysis;
  }

  private async createSession(session: FunnelSession): Promise<void> {
    try {
      // In production, this would save to database
      console.log('💾 Creating session:', session.id);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  }

  private async updateSession(sessionId: string, updates: Partial<FunnelSession>): Promise<void> {
    try {
      // In production, this would update database
      console.log('📝 Updating session:', sessionId, updates);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }

  private async flushEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    try {
      // In production, this would batch insert to database
      console.log(`📊 Flushing ${this.eventQueue.length} events to database`);
      this.eventQueue = [];
    } catch (error) {
      console.error('Error flushing events:', error);
    }
  }

  private setupEventListeners(): void {
    // Track button clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        this.trackEvent({
          eventType: 'button_click',
          eventData: {
            element: target.tagName,
            text: target.textContent?.trim(),
            href: target.getAttribute('href'),
            className: target.className
          }
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackEvent({
        eventType: 'form_submit',
        eventData: {
          formId: form.id,
          formAction: form.action,
          formMethod: form.method,
          fieldCount: form.elements.length
        }
      });
    });

    // Track scroll depth
    let maxScroll = 0;
    document.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > maxScroll + 25) { // Track every 25%
        maxScroll = Math.floor(scrollPercent / 25) * 25;
        this.trackEvent({
          eventType: 'scroll',
          eventData: {
            scrollDepth: maxScroll,
            scrollY: window.scrollY
          }
        });
      }
    });

    // Track page exit
    window.addEventListener('beforeunload', () => {
      this.trackEvent({
        eventType: 'exit',
        eventData: {
          timeOnPage: Date.now() - (parseInt(this.activeSession?.split('_')[1] || '0'))
        }
      });
      this.flushEventQueue();
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|android(?!.*mobile)/i.test(userAgent)) return 'tablet';
    if (/mobile|android/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private getCampaignFromUrl(): string | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_campaign') || undefined;
  }

  private async generateStepAnalysis(): Promise<StepAnalysis[]> {
    const steps = ['Landing', 'Signup', 'Onboarding', 'First Action', 'Conversion'];
    return steps.map((step, index) => ({
      stepName: step,
      stepOrder: index + 1,
      visitors: Math.floor(Math.random() * 1000) + 100,
      conversions: Math.floor(Math.random() * 800) + 50,
      conversionRate: Math.random() * 0.8 + 0.1,
      avgTimeSpent: Math.floor(Math.random() * 300) + 30,
      exitRate: Math.random() * 0.4 + 0.1
    }));
  }

  private async generateTopPaths(): Promise<ConversionPath[]> {
    const paths = [
      ['Landing', 'Signup', 'Conversion'],
      ['Landing', 'Pricing', 'Signup', 'Conversion'],
      ['Landing', 'Features', 'Signup', 'Conversion'],
      ['Landing', 'Testimonials', 'Signup', 'Conversion']
    ];

    return paths.map((path, index) => ({
      sessionId: `path_${index}`,
      path,
      timeToConversion: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
      touchpoints: path.length,
      converted: Math.random() > 0.3,
      dropOffStep: Math.random() > 0.7 ? path[Math.floor(Math.random() * path.length)] : undefined
    }));
  }

  private async generateDropOffAnalysis(): Promise<DropOffAnalysis[]> {
    return [
      {
        stepName: 'Landing Page',
        dropOffRate: Math.random() * 0.3 + 0.2, // 20-50%
        commonExitActions: ['Back button', 'Close tab', 'External link'],
        improvementSuggestions: ['Strengthen value proposition', 'Reduce load time', 'Add social proof']
      },
      {
        stepName: 'Signup Form',
        dropOffRate: Math.random() * 0.4 + 0.1, // 10-50%
        commonExitActions: ['Form abandonment', 'Validation errors', 'Privacy concerns'],
        improvementSuggestions: ['Reduce form fields', 'Add progress indicator', 'Improve error messages']
      }
    ];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async stopTracking(): Promise<void> {
    if (!this.isTracking) return;

    console.log('⏹️ Stopping funnel tracking');
    
    // Flush remaining events
    await this.flushEventQueue();

    // End session
    if (this.activeSession) {
      await this.updateSession(this.activeSession, {
        endTime: new Date().toISOString()
      });
    }

    this.isTracking = false;
    this.activeSession = null;
  }
}

interface StepAnalysis {
  stepName: string;
  stepOrder: number;
  visitors: number;
  conversions: number;
  conversionRate: number;
  avgTimeSpent: number;
  exitRate: number;
}

interface DropOffAnalysis {
  stepName: string;
  dropOffRate: number;
  commonExitActions: string[];
  improvementSuggestions: string[];
}
