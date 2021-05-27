import SPELLS from 'common/SPELLS';
import HealingEfficiencyTracker, {
  SpellInfoDetails,
} from 'parser/core/healingEfficiency/HealingEfficiencyTracker';
import ManaTracker from 'parser/core/healingEfficiency/ManaTracker';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';
import DamageDone from 'parser/shared/modules/throughput/DamageDone';
import HealingDone from 'parser/shared/modules/throughput/HealingDone';

import Abilities from '../Abilities';
import RegrowthAttributor from '../core/hottracking/RegrowthAttributor';
import RegrowthAndClearcasting from '../features/RegrowthAndClearcasting';

/*
    TODO:
      * Some spells contain multiple healIds, create a graphical breakdown
      * Factor in mastery healing
      * Add more descriptions
 */
class RestoDruidHealingEfficiencyTracker extends HealingEfficiencyTracker {
  static dependencies = {
    manaTracker: ManaTracker,
    abilityTracker: AbilityTracker,
    healingDone: HealingDone,
    damageDone: DamageDone,
    castEfficiency: CastEfficiency,

    // Custom dependencies
    abilities: Abilities,
    regrowthAttributor: RegrowthAttributor,
    clearcasting: RegrowthAndClearcasting,
  };

  protected manaTracker!: ManaTracker;
  protected abilityTracker!: AbilityTracker;
  protected healingDone!: HealingDone;
  protected damageDone!: DamageDone;
  protected castEfficiency!: CastEfficiency;

  // Custom dependencies
  protected abilities!: Abilities;
  protected regrowthAttributor!: RegrowthAttributor;
  protected clearcasting!: RegrowthAndClearcasting;

  getCustomSpellStats(spellInfo: SpellInfoDetails, spellId: number) {
    // If we have a spell that has custom logic for the healing/damage numbers, do that before the rest of our calculations.
    if (spellId === SPELLS.REGROWTH.id) {
      spellInfo = this.getRegrowthDetails(spellInfo);
    }

    return spellInfo;
  }

  getRegrowthDetails(spellInfo: SpellInfoDetails) {
    // This represents that amount of healing done by HARD CASTING regrowth.
    // We don't want regrowth to get Hpm credit for healing that we didn't spend mana on.
    spellInfo.healingDone = this.regrowthAttributor.totalNonCCRegrowthHealing;
    spellInfo.overhealingDone = this.regrowthAttributor.totalNonCCRegrowthOverhealing;
    spellInfo.casts = this.clearcasting.badRegrowths;

    return spellInfo;
  }
}

export default RestoDruidHealingEfficiencyTracker;
