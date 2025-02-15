'use client';

import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Trophy, Sparkles, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TaxSavingSuggestionsProps {
  income: number;
  currentRelief: number;
  taxableIncome: number;
  citizenshipStatus: 'CITIZEN_PR' | 'FOREIGNER';
}

export function TaxSavingSuggestions({ 
  income, 
  currentRelief, 
  taxableIncome,
  citizenshipStatus 
}: TaxSavingSuggestionsProps) {
  const MAX_CPF_RELIEF = citizenshipStatus === 'CITIZEN_PR' ? 16000 : 0;
  const MAX_SRS = citizenshipStatus === 'FOREIGNER' ? 35700 : 15300;
  const TOTAL_MAX_RELIEF = MAX_CPF_RELIEF + MAX_SRS;
  
  // Simple check for maximized
  const isMaximized = citizenshipStatus === 'FOREIGNER' 
    ? currentRelief >= MAX_SRS 
    : currentRelief >= TOTAL_MAX_RELIEF;

  console.log('Simple debug:', {
    currentRelief,
    MAX_SRS,
    isMaximized,
    citizenshipStatus,
    renderingCondition: isMaximized && taxableIncome > 20000
  });

  // Only basic checks
  if (taxableIncome <= 20000) {
    console.log('Returning null due to low taxable income');
    return null;
  }

  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-4">
        {isMaximized ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <motion.div 
              className="flex items-center gap-2 flex-wrap"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1] }}
            >
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h3 className="font-semibold text-lg">Congratulations!</h3>
              <Badge variant="success">
                Maximum Relief Achieved
              </Badge>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </motion.div>
            </motion.div>

            <div className="bg-primary/5 rounded-lg p-4 space-y-4">
              <p className="font-medium">
                You have maximized your {citizenshipStatus === 'FOREIGNER' ? 'SRS contributions' : 'tax relief contributions'}!
              </p>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Current Utilization</h4>
                {citizenshipStatus === 'CITIZEN_PR' ? (
                  <>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>SRS Contributions</span>
                          <span className="font-medium">
                            ${formatCurrency(Math.min(currentRelief, MAX_SRS))} / ${formatCurrency(MAX_SRS)}
                          </span>
                        </div>
                        <motion.div 
                          className="h-2 bg-muted rounded-full overflow-hidden"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "100%" }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div 
                            className="h-full bg-primary rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(Math.min(currentRelief, MAX_SRS) / MAX_SRS) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                          />
                        </motion.div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CPF Cash Top-up</span>
                          <span className="font-medium">
                            ${formatCurrency(Math.max(0, currentRelief - MAX_SRS))} / ${formatCurrency(MAX_CPF_RELIEF)}
                          </span>
                        </div>
                        <motion.div 
                          className="h-2 bg-muted rounded-full overflow-hidden"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "100%" }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div 
                            className="h-full bg-primary rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(Math.max(0, currentRelief - MAX_SRS) / MAX_CPF_RELIEF) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>SRS Contributions</span>
                      <span className="font-medium">
                        ${formatCurrency(currentRelief)} / ${formatCurrency(MAX_SRS)}
                      </span>
                    </div>
                    <motion.div 
                      className="h-2 bg-muted rounded-full overflow-hidden"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "100%" }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="h-full bg-primary rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentRelief / MAX_SRS) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2 border-t">
                <h4 className="font-medium">Other Tax Relief Options</h4>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start group" asChild>
                    <a 
                      href="https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions/tax-reliefs/course-fees-relief"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Course Fees Relief
                      <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </Button>
                  {/* Add more relief options as needed */}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </Card>
  );
} 