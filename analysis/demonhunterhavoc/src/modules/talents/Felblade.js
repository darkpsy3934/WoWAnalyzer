import { t } from '@lingui/macro';
import { formatPercentage, formatThousands } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events from 'parser/core/Events';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import ItemDamageDone from 'parser/ui/ItemDamageDone';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import React from 'react';

/**
 * Example Report: https://www.warcraftlogs.com/reports/1HRhNZa2cCkgK9AV#fight=48&type=summary&source=10
 */
class Felblade extends Analyzer {
  get furyPerMin() {
    return ((this.furyGain - this.furyWaste) / (this.owner.fightDuration / 60000)).toFixed(2);
  }

  get suggestionThresholds() {
    return {
      actual: this.furyWaste / this.furyGain,
      isGreaterThan: {
        minor: 0.03,
        average: 0.07,
        major: 0.1,
      },
      style: 'percentage',
    };
  }

  furyGain = 0;
  furyWaste = 0;
  damage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.FELBLADE_TALENT.id);
    if (!this.active) {
      return;
    }
    this.addEventListener(
      Events.resourcechange.by(SELECTED_PLAYER).spell(SPELLS.FELBLADE_DAMAGE),
      this.onEnergizeEvent,
    );
    this.addEventListener(
      Events.damage.by(SELECTED_PLAYER).spell(SPELLS.FELBLADE_DAMAGE),
      this.onDamageEvent,
    );
  }

  onEnergizeEvent(event) {
    this.furyGain += event.resourceChange;
    this.furyWaste += event.waste;
  }

  onDamageEvent(event) {
    this.damage += event.amount + (event.absorbed || 0);
  }

  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          {' '}
          Avoid casting <SpellLink id={SPELLS.FELBLADE_TALENT.id} /> close to Fury cap and cast
          abilities regularly to avoid accidently capping your fury.
        </>,
      )
        .icon(SPELLS.FELBLADE_TALENT.icon)
        .actual(
          t({
            id: 'demonhunter.havoc.suggestions.felBlade.furyWasted',
            message: `${formatPercentage(actual)}% Fury wasted`,
          }),
        )
        .recommended(`${formatPercentage(recommended)}% is recommended.`),
    );
  }

  statistic() {
    const effectiveFuryGain = this.furyGain - this.furyWaste;
    return (
      <Statistic
        size="flexible"
        category={STATISTIC_CATEGORY.TALENTS}
        tooltip={
          <>
            {effectiveFuryGain} Effective Fury gained
            <br />
            {this.furyGain} Total Fury gained
            <br />
            {this.furyWaste} Fury wasted
            <br />
            {formatThousands(this.damage)} Total damage
          </>
        }
      >
        <BoringSpellValueText spellId={SPELLS.FELBLADE_TALENT.id}>
          <>
            {this.furyPerMin} <small>Fury per min </small>
            <br />
            <ItemDamageDone amount={this.damage} />
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default Felblade;
