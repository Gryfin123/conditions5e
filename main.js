/**
 * An array of status effect icons which can be applied to Tokens
 * @type {Array}
 */
Hooks.once("init", function () {
  console.log(CONFIG.statusEffects);
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
      id: "stun",
      label: "EFFECT.StatusStunned",
      icon: "modules/conditions5e/icons/stunned.svg"
    },
    {
      id: "exhaustion1",
      label: "EFFECT.StatusExhausted1",
      icon: "modules/conditions5e/icons/exhaustion1.svg"
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
      id: "exhaustion2",
      label: "EFFECT.StatusExhausted2",
      icon: "modules/conditions5e/icons/exhaustion2.svg"
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
      id: "prone",
      label: "EFFECT.StatusProne",
      icon: "modules/conditions5e/icons/prone.svg"
    },
    {
      id: "exhaustion3",
      label: "EFFECT.StatusExhausted3",
      icon: "modules/conditions5e/icons/exhaustion3.svg"
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
      id: "exhaustion4",
      label: "EFFECT.StatusExhausted4",
      icon: "modules/conditions5e/icons/exhaustion4.svg"
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
      id: "exhaustion5",
      label: "EFFECT.StatusExhausted5",
      icon: "modules/conditions5e/icons/exhaustion5.svg"
    },
  ];

  // Add created effects to the list instead of replacing
  for (i = 0; i < addedEffects.length; i++)
  {
    CONFIG.statusEffects.push(addedEffects[i]);
  }
  console.log(CONFIG.statusEffects);

  // Replace selected control icons
  CONFIG.controlIcons.visibility = "modules/conditions5e/icons/invisible.svg";
  CONFIG.controlIcons.defeated = "modules/conditions5e/icons/dead.svg";
});

// Function to use token overlay to show status as wounded, unconscious, or dead
Token.prototype._updateHealthOverlay = function () {
  let maxHP = this.actor.data.data.attributes.hp.max;
  let curHP = this.actor.data.data.attributes.hp.value;
  let priorHealth = this.data.overlayEffect;
  let newHealth = null;
  if (curHP <= 0) {
    if (priorHealth === "modules/conditions5e/icons/almostdead.svg") 
    {
      newHealth = priorHealth;
    }
    else 
    {
      newHealth = "modules/conditions5e/icons/dead.svg";
    }
  } 
  else if (curHP / maxHP < 0.5) 
  {
    newHealth = "modules/conditions5e/icons/wounded.svg";
  }

  if (newHealth !== priorHealth) {
      if (newHealth === null) 
      {
        this.toggleEffect(priorHealth, { overlay: true });
      }
      else 
      {
        this.toggleEffect(newHealth, { overlay: true });
      }
  }
};

// This hook is required for Tokens NOT linked to an Actor
Hooks.on("updateToken", (scene, tokenData, update, options, userId) => {
  let token = canvas.tokens.get(update._id);
  if (token.owner) token._updateHealthOverlay();
});

// This hook is required for Tokens linked to an Actor
Hooks.on("updateActor", (entity, updated) => {
  if (entity.owner) entity.getActiveTokens(true).map(x => x._updateHealthOverlay());
});