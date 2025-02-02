import { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { CastEvent, RemoveBuffEvent } from 'parser/core/Events';
import CoreChanneling from 'parser/shared/modules/Channeling';

import * as SPELLS from '../../SPELLS';

class Channeling extends CoreChanneling {
  constructor(options: Options) {
    super(options);
    this.addEventListener(
      Events.removebuff.by(SELECTED_PLAYER).spell({ id: SPELLS.EVOCATION }),
      this.onRemoveBuff,
    );
  }

  onCast(event: CastEvent) {
    const spellId = event.ability.guid;
    if (spellId === SPELLS.ARCANE_MISSILES || spellId === SPELLS.EVOCATION) {
      this.beginChannel(event);
      return;
    }
    super.onCast(event);
  }

  onRemoveBuff(event: RemoveBuffEvent) {
    // This will resolve potential issues with evocation showing longer channel times
    if (this.isChannelingSpell(SPELLS.EVOCATION)) {
      this.endChannel(event);
    }
  }

  cancelChannel(event: any, ability: any) {
    if (
      this.isChannelingSpell(SPELLS.ARCANE_MISSILES) ||
      this.isChannelingSpell(SPELLS.EVOCATION)
    ) {
      this.endChannel(event);
      return;
    }
    super.cancelChannel(event, ability);
  }
}

export default Channeling;
