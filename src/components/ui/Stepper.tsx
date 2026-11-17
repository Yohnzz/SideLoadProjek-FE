import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id?: string | number;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div className="flex items-center justify-between min-w-[500px] gap-2 p-2 bg-[#F0F1F5] rounded-[12px]">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <div
              key={step.id || index}
              onClick={() => isClickable && onStepClick(stepNumber)}
              className={`flex-1 flex items-center gap-3 p-3 rounded-[9px] transition-all duration-150 ${
                isClickable ? 'cursor-pointer' : ''
              } ${
                isCurrent
                  ? 'bg-white shadow-xs border border-[#E5E7EB]'
                  : isCompleted
                  ? 'hover:bg-white/60'
                  : 'opacity-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-[#16A34A] text-white'
                    : isCurrent
                    ? 'bg-[#2373FB] text-white'
                    : 'bg-[#D1D5DB] text-[#737887]'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : stepNumber}
              </div>

              <div className="flex flex-col min-w-0">
                <span
                  className={`text-xs font-semibold truncate ${
                    isCurrent ? 'text-[#171923]' : 'text-[#737887]'
                  }`}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-[10px] text-[#737887] truncate">{step.description}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

