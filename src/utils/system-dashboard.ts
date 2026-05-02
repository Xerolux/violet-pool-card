import type { VioletPoolCardConfig } from '../violet-pool-card';

export interface SystemCardGroups {
  controlCards: VioletPoolCardConfig[];
  utilityCards: VioletPoolCardConfig[];
}

export function getSystemCardGroups(
  dashboardMode: string,
  controlCards: Array<VioletPoolCardConfig | null>,
  utilityCards: Array<VioletPoolCardConfig | null>,
  maintenanceUtilityCards: Array<VioletPoolCardConfig | null>,
  alarmControlCards: Array<VioletPoolCardConfig | null>,
  alarmUtilityCards: Array<VioletPoolCardConfig | null>
): SystemCardGroups {
  const baseControls = controlCards.filter(Boolean) as VioletPoolCardConfig[];
  const baseUtilities = utilityCards.filter(Boolean) as VioletPoolCardConfig[];

  if (dashboardMode === 'maintenance') {
    return {
      controlCards: baseControls,
      utilityCards: maintenanceUtilityCards.filter(Boolean) as VioletPoolCardConfig[],
    };
  }

  if (dashboardMode === 'alarm_center') {
    return {
      controlCards: alarmControlCards.filter(Boolean) as VioletPoolCardConfig[],
      utilityCards: alarmUtilityCards.filter(Boolean) as VioletPoolCardConfig[],
    };
  }

  return {
    controlCards: baseControls,
    utilityCards: baseUtilities,
  };
}
