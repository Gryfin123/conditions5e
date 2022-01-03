/**
 * An array of status effect icons which can be applied to Tokens
 * @type {Array}
 */
Hooks.once("init", function () {
  addedEffects = [
    {
      id: "dead",
      label: "EFFECT.StatusDead",
      icon: "modules/conditions5e/icons/dead.svg"
    },
    {
      id: "unconscious",
      label: "EFFECT.StatusUnconscious",
      icon: "modules/conditions5e/icons/unconscious.svg"
    },
    {
      id: "incapacitated",
      label: "EFFECT.StatusIncapacitated",
      icon: "modules/conditions5e/icons/incapacitated.svg"
    },
    {
      id: "paralysis",
      label: "EFFECT.StatusParalysis",
      icon: "modules/conditions5e/icons/paralyzed.svg",
    },
    {
      id: "petrified",
      label: "EFFECT.StatusPetrified",
      icon: "modules/conditions5e/icons/petrified.svg",
    },
    {
      id: "grappled",
      label: "EFFECT.StatusGrappled",
      icon: "modules/conditions5e/icons/grappled.svg",
    },
    {
      id: "restrain",
      label: "EFFECT.StatusRestrained",
      icon: "modules/conditions5e/icons/restrained.svg",
    },
    {
      id: "charmed",
      label: "EFFECT.StatusCharmed",
      icon: "modules/conditions5e/icons/charmed.svg"
    },
    {
      id: "fear",
      label: "EFFECT.StatusFear",
      icon: "modules/conditions5e/icons/frightened.svg"
    },
    {
      id: "poison",
      label: "EFFECT.StatusPoison",
      icon: "modules/conditions5e/icons/poisoned.svg"
    },
    {
      id: "blind",
      label: "EFFECT.StatusBlind",
      icon: "modules/conditions5e/icons/blinded.svg"
    },
    {
      id: "deaf",
      label: "EFFECT.StatusDeaf",
      icon: "modules/conditions5e/icons/deafened.svg"
    },
    {
      id: "disease",
      label: "EFFECT.StatusDisease",
      icon: "modules/conditions5e/icons/diseased.svg"
    },
    {
      id: "exhaustion1",
      label: "EFFECT.StatusExhausted1",
      icon: "modules/conditions5e/icons/exhaustion1.svg"
    },
    {
      id: "exhaustion2",
      label: "EFFECT.StatusExhausted2",
      icon: "modules/conditions5e/icons/exhaustion2.svg"
    },
    {
      id: "exhaustion3",
      label: "EFFECT.StatusExhausted3",
      icon: "modules/conditions5e/icons/exhaustion3.svg"
    },
    {
      id: "exhaustion4",
      label: "EFFECT.StatusExhausted4",
      icon: "modules/conditions5e/icons/exhaustion4.svg"
    },
    {
      id: "exhaustion5",
      label: "EFFECT.StatusExhausted5",
      icon: "modules/conditions5e/icons/exhaustion5.svg"
    }, 
    {
        id: "wounded", 
        label: "EFFECT.StatusWounded", 
        icon: "modules/conditions5e/icons/wounded.svg"
    }
  ];

  // Add created effects to the list instead of replacing it
  for (i = 0; i < addedEffects.length; i++)
  {
    // Remove already existin status effect with the same id
    const currentElementId = addedEffects[i].id;
    const presentIndex = CONFIG.statusEffects.findIndex(
      (status) => status.id === currentElementId
    )

    if (presentIndex !== -1)
    {
      // Replace icon
      CONFIG.statusEffects[presentIndex] = addedEffects[i];
    }
    else
    {
      // Add new status
      CONFIG.statusEffects.push(addedEffects[i]);
    }
  }

  // Replace selected control icons
  CONFIG.controlIcons.visibility = "modules/conditions5e/icons/invisible.svg";
  CONFIG.controlIcons.defeated = "modules/conditions5e/icons/dead.svg";
});

let icon_dead =         {id: "dead", label: "EFFECT.StatusDead", icon: "modules/conditions5e/icons/dead.svg"};
let icon_unconscious =  {id: "unconscious", label: "EFFECT.StatusUnconscious", icon: "modules/conditions5e/icons/unconscious.svg"};
let icon_wounded =      {id: "wounded", label: "EFFECT.StatusWounded", icon: "modules/conditions5e/icons/wounded.svg"};

// Function to use token overlay to show status as wounded, unconscious, or dead
Token.prototype._updateHealthOverlay = function () {
    console.log(this);
    let newOverlay = determineNewOverlay(this);
  
    // If any Overlay status applies to this token now.
    clearOverlayEffects(this)
    if (newOverlay !== null)
    {
        turnOnOverlayEffect(this, newOverlay);
    }
};

/// --- SUPPORT FUNCTIONS ---

// Clears overlayas effects of wounded, dead or unconcious. 
function clearOverlayEffects(token){
    turnOffOverlayEffect(token, icon_dead)
    turnOffOverlayEffect(token, icon_unconscious)
    turnOffOverlayEffect(token, icon_wounded)
}
// Gets current overlay effect(s?) of a token
function fetchCurrentOverlay(token){
    const existing = token.actor.effects.find(e => e.getFlag("core", "overlay") === true);
    console.log("Existing:")
    console.log(existing);
    return existing;
}
// Determine if any new overlay applies to the token.
function determineNewOverlay(token){
    let maxHP = token.actor.data.data.attributes.hp.max;
    let curHP = token.actor.data.data.attributes.hp.value;
    let currentOverlay = fetchCurrentOverlay(token);

    if (curHP <= 0) {
        if (currentOverlay.icon === icon_unconscious.icon) 
        {
            return icon_unconscious;
        }
        else 
        {
            return icon_dead;
        }
    } 
    else if (curHP / maxHP <= 0.5) 
    {
        return icon_wounded;
    }
    else
    {
        return null;
    }
}
// Make sure that certain effect stays on the token.
function turnOnOverlayEffect(token, effect) {
    const existing = token.actor.effects.find(e => e.getFlag("core", "statusId") === effect.id);

    // Effect is present on the token and is an overlay.
    if (!existing)
    {
        // Remove status effect
        token.toggleEffect(effect, { overlay: true });
    }
}
// Make sure that certain effect is removed.
function turnOffOverlayEffect(token, effect){
    const existing = token.actor.effects.find(e => e.getFlag("core", "statusId") === effect.id);

    // Effect is present on the token and is an overlay.
    if (existing)
    {
        // Remove status effect
        token.toggleEffect(effect, { overlay: true });
    }
}   

/// --- HOOKS ---

// This hook is required for Tokens NOT linked to an Actor
/*Hooks.on("updateToken", (scene, tokenData, update, options, userId) => {
  console.log("Check 1")
  console.log(scene)
  console.log(tokenData)
  console.log(update)
  console.log(options)
  console.log(userId)
  let token = canvas.tokens.get(update._id);
  token._updateHealthOverlay();
});*/
// This hook is required for Tokens linked to an Actor
Hooks.on("updateActor", (entity, updated) => {
  entity.getActiveTokens(true).map(x => x._updateHealthOverlay());
});

/*
function hehehehetoggleActiveEffect(effectData, {overlay=false, active}={}) {
    if ( !this.actor || !effectData.id ) return false;

    // Remove an existing effect
    const existing = this.actor.effects.find(e => e.getFlag("core", "statusId") === effectData.id);
    const state = active ?? !existing;
    if ( !state && existing ) await existing.delete();

    // Add a new effect
    else if ( state ) {
      const createData = foundry.utils.deepClone(effectData);
      createData.label = game.i18n.localize(effectData.label);
      createData["flags.core.statusId"] = effectData.id;
      if ( overlay ) createData["flags.core.overlay"] = true;
      delete createData.id;
      const cls = getDocumentClass("ActiveEffect");
      await cls.create(createData, {parent: this.actor});
    }
    return state;
  }*/