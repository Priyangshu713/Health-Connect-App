import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb, ArrowRight, BrainCircuit } from 'lucide-react';
import { useHealthStore } from '@/store/healthStore';
import { getDailyInsight, DailyInsight } from '@/services/InvisibleAIService';
import { motion, AnimatePresence } from 'framer-motion';

const SmartInsightCard = () => {
  const { healthData, geminiApiKey, geminiTier } = useHealthStore();
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  const isPro = geminiTier === 'pro';

  useEffect(() => {
    const fetchInsight = async () => {
      // Only fetch if Pro, API key exists, and we haven't fetched today (mock logic for "today" for now)
      if (isPro && geminiApiKey && !insight) {
        setLoading(true);
        const data = await getDailyInsight(healthData, geminiApiKey);
        setInsight(data);
        setLoading(false);
      }
    };

    fetchInsight();
  }, [isPro, geminiApiKey, healthData]);

  if (!visible) return null;

  if (!isPro) return null; // Invisible for non-pro users

  if (loading) {
    return (
      <Card className="w-full border-health-lavender/20 bg-gradient-to-r from-white to-health-lavender/5 mb-6">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-health-lavender/20 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 bg-health-lavender/20 rounded animate-pulse" />
            <div className="h-3 w-3/4 bg-health-lavender/10 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insight) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full border-health-lavender/30 bg-gradient-to-br from-white via-health-lavender/5 to-white shadow-sm mb-6 overflow-hidden relative">
          {/* Decorative background element */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-health-lavender/10 blur-2xl" />
          
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-health-lavender/10 text-health-lavender">
                <Sparkles className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-medium text-health-lavender-dark">
                Daily Smart Insight
              </CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => setVisible(false)}
            >
              <span className="sr-only">Dismiss</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.1929 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.1929 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  {insight.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {insight.insight}
                </p>
              </div>
              
              <div className="bg-white/60 rounded-lg p-3 border border-health-lavender/10 flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Action Item</span>
                  <p className="text-sm font-medium text-foreground">
                    {insight.actionItem}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartInsightCard;
