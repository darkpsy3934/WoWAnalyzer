import SPELLS from 'common/SPELLS';
import SPECS from 'game/SPECS';
import { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events from 'parser/core/Events';
import Abilities from 'parser/core/modules/Abilities';
import ExecuteHelper from 'parser/shared/modules/helpers/ExecuteHelper';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import ItemDamageDone from 'parser/ui/ItemDamageDone';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';
import React from 'react';

import { KILL_SHOT_EXECUTE_RANGE } from './constants';
import FlayedShot from './covenants/venthyr/FlayedShot';

class KillShot extends ExecuteHelper {
  static executeSources = SELECTED_PLAYER;
  static lowerThreshold = KILL_SHOT_EXECUTE_RANGE;
  static executeOutsideRangeEnablers = [SPELLS.FLAYERS_MARK];
  static modifiesDamage = false;
  static countCooldownAsExecuteTime = true;

  static dependencies = {
    ...ExecuteHelper.dependencies,
    abilities: Abilities,
    flayedShot: FlayedShot,
  };

  maxCasts: number = 0;
  activeKillShotSpell =
    this.selectedCombatant.spec === SPECS.SURVIVAL_HUNTER
      ? SPELLS.KILL_SHOT_SV
      : SPELLS.KILL_SHOT_MM_BM;

  protected abilities!: Abilities;
  protected flayedShot!: FlayedShot;

  constructor(options: Options) {
    super(options);

    this.addEventListener(Events.fightend, this.adjustMaxCasts);
    const ctor = this.constructor as typeof ExecuteHelper;
    ctor.executeSpells.push(this.activeKillShotSpell);

    (options.abilities as Abilities).add({
      spell: this.activeKillShotSpell.id,
      category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
      charges: this.selectedCombatant.hasTalent(SPELLS.DEAD_EYE_TALENT.id) ? 2 : 1,
      cooldown: 10,
      gcd: {
        base: 1500,
      },
      castEfficiency: {
        suggestion: true,
        recommendedEfficiency: 0.85,
        maxCasts: () => this.maxCasts,
      },
    });
  }

  adjustMaxCasts() {
    this.maxCasts += Math.ceil(this.totalExecuteDuration / 10000);
    if (this.selectedCombatant.hasTalent(SPELLS.DEAD_EYE_TALENT.id)) {
      this.maxCasts += 1;
    }
    this.maxCasts += this.flayedShot.totalProcs;
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(13)}
        size="flexible"
        category={STATISTIC_CATEGORY.GENERAL}
      >
        <BoringSpellValueText spellId={this.activeKillShotSpell.id}>
          <ItemDamageDone amount={this.damage} />
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default KillShot;
