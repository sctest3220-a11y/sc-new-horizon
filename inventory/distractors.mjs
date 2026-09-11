// Scenario-specific distractors for numerical reasoning. Every choice uses the same evidence.
export const specificDistractors = {
  'D3-data-chart-judgment': {
    awareness: [
      [
        ['The increase is 10% relative to the original rate.', 'The relative increase is 10 divided by 40, which is 25%.'],
        ['The increase is 25 percentage points.', 'Twenty-five percent is the relative increase, not the point difference.'],
        ['The success rate has increased by 50%.', 'The final rate of 50% is not the size of the increase.'],
      ],
      [
        ['The error rate is 12% because 12 errors were recorded.', 'A count becomes a percentage only with a denominator.'],
        ['The error rate is lower than before because only 12 errors appear.', 'Neither the prior count nor the exposure is supplied.'],
        ['The error rate is 88% after subtracting the errors from 100.', 'The record count is unknown, so subtraction from 100 is unjustified.'],
      ],
      [
        ['The larger bar establishes higher throughput.', 'Submitted and completed cases measure different stages.'],
        ['The smaller bar establishes poorer staff performance.', 'The inconsistent definitions prevent that comparison.'],
        ['The two bars are comparable because both count cases.', 'They count different events even though both use case units.'],
      ],
      [
        ['The two values differ by roughly half of the baseline.', 'The numerical difference is one unit, not half of 99.'],
        ['The truncated axis proves that the underlying values are false.', 'The scale can mislead without making the values themselves false.'],
        ['The chart establishes a statistically reliable improvement.', 'Axis design does not supply sample size or uncertainty evidence.'],
      ],
    ],
    applied: [
      [
        ['Report a 5% reduction from the original time.', 'Five minutes is the absolute reduction, not a five-percent reduction.'],
        ['Report a 33.3% reduction using the new time as baseline.', 'The requested reduction uses the original 20-minute baseline.'],
        ['Report a 75% reduction because 15 divided by 20 is 0.75.', 'Seventy-five percent is the remaining time, not the reduction.'],
      ],
      [
        ['Compare 8% for A with 12% for B.', 'Those percentages incorrectly treat the error counts as rates.'],
        ['Prefer A because it has fewer errors in total.', 'The teams process different volumes; B has the lower error rate.'],
        ['Treat the teams as equal because both have more correct than incorrect cases.', 'That broad statement conceals a twofold difference in error rates.'],
      ],
      [
        ['Compare the total average without adjusting for case complexity.', 'Different case mixes can drive the observed average difference.'],
        ['Remove complex cases from the future workload to preserve the pilot score.', 'Changing service scope does not establish improvement on the original task.'],
        ['Assume the pilot gain transfers to complex cases at the same rate.', 'No evidence for that transfer is supplied.'],
      ],
      [
        ['Attribute all improvement to AI because AI was introduced during the period.', 'Timing alone does not separate concurrent interventions.'],
        ['Attribute all improvement to training because training reached everyone.', 'The evidence also does not isolate the training effect.'],
        ['Split the gain equally between AI, training, and the new process.', 'Equal attribution is arbitrary without a design that estimates each effect.'],
      ],
    ],
  },
  'D5-roi-metrics': {
    awareness: [
      [
        ['The measured saving is 15 minutes per completed item.', 'That calculation omits the ten minutes of review.'],
        ['The measured saving is 10 minutes per completed item.', 'Both five minutes of drafting and ten minutes of review must be counted.'],
        ['The measured saving is 25 minutes per completed item.', 'Adding the old and new draft times is not a saving calculation.'],
      ],
      [
        ['Every login represents a successfully completed task.', 'A login does not establish task completion.'],
        ['More logins establish higher output quality.', 'The metric contains no quality observation.'],
        ['Login growth can be recorded directly as cost savings.', 'A usage count does not measure a reduction in expenditure.'],
      ],
      [
        ['All saved hours are realized cash savings immediately.', 'Costs have not been reduced and no realization plan is supplied.'],
        ['Released hours have no possible value under any conditions.', 'Capacity can create value if it is effectively redeployed or costs change.'],
        ['Saved hours should be counted as both cash and extra output at full value.', 'The same capacity cannot be fully realized twice without supporting evidence.'],
      ],
      [
        ['Fewer errors always means a lower error rate.', 'The volume could also have fallen, potentially increasing the rate.'],
        ['The error rate is unchanged because the denominator is missing.', 'Missing evidence establishes uncertainty, not an unchanged result.'],
        ['The percentage change equals the change in error count.', 'A rate comparison also depends on exposure in each period.'],
      ],
    ],
    applied: [
      [
        ['Report 120 units net benefit and 150% ROI.', 'The 120 units are gross benefit; operating cost has not been subtracted.'],
        ['Report 40 units net benefit and 33.3% ROI on operating cost.', 'That ratio uses benefit as the denominator instead of the 80-unit cost.'],
        ['Report 200 units net benefit and 250% ROI.', 'Adding benefit and cost does not calculate net benefit.'],
      ],
      [
        ['Report a net saving of 10 work hours.', 'That claim ignores the added review and correction work.'],
        ['Report a net saving of 3 work hours.', 'Subtracting review alone omits five hours of correction.'],
        ['Report a net saving of 2 work hours.', 'The total is two additional hours, not two hours saved.'],
      ],
      [
        ['Compare only the subscription cost because internal work is already staffed.', 'Existing staff capacity still has an opportunity cost in the workflow.'],
        ['Exclude integration effort because it occurs before routine operation.', 'Setup effort belongs in a consistently defined investment horizon.'],
        ['Count review and support only if the vendor invoices them.', 'Internally incurred costs are still part of the economic comparison.'],
      ],
      [
        ['Declare the pilot successful using speed as the only outcome.', 'The rise in material errors is relevant to the value of the workflow.'],
        ['Convert every minute saved to cash without accounting for error remediation.', 'The claim omits an observed adverse operating cost.'],
        ['Average time and error percentages into a single unweighted number.', 'Combining unlike measures arbitrarily can conceal the tradeoff.'],
      ],
    ],
  },
};
