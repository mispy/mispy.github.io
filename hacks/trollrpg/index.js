// Generated by CoffeeScript 1.3.3
(function() {
  var BLOOD_COLORS, QUALITIES, chooseAspect, chooseBlood, chooseClass, choosePersonality, chooseQuality, dice, main, makeCharacter,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  dice = function(n, m) {
    var i, val, _i, _ref;
    val = 0;
    for (i = _i = 0, _ref = n - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      val += Math.ceil(Math.random() * m);
    }
    return val;
  };

  window.PERSONALITIES = {
    'Childish': "+1 Luck, -1 Athletics",
    'Bully': "+1 Cunning, -1 Will",
    'Pure': "+1 Charisma, -1 Cunning",
    'Cool': "+1 Skill, -1 Charisma",
    'Adventurous': "+1 Athletics, -1 Skill",
    'Leader': "+1 Will, -1 Luck"
  };

  QUALITIES = {
    "FLARPer": "you are already versed in combat, and likely have some good loot.",
    "Programmer": "you know the in and outs of coding. ~ATH is likely in your arsenal.",
    "Shipper": "you pay close attention to all of your friends and like to play matchmaker.",
    "Rule Follower": "whether it’s the law, the hemospectrum, or some other ruleset, you adhere to it religiously.",
    "Screw the Rules": "You don’t even care about the rules.",
    "Juggalo": "You belong to the clown cult. You wear makeup, drink the wicked elixir, and espouse equality for all in death.",
    "Jacket": "Extra pockets! Awesome.",
    "Glasses": "You most likely need these to see.",
    "Sunglasses": "Too cool for school.",
    "Red Clothes": "whatever you want is now red, sans your symbol.",
    "Inverted Colors": "wear your colors, with a black symbol",
    "FASHIONISTA": "wear whatever you want, whenever you want",
    "Scholar": "You want to learn. + 1 to checks involving learning.",
    "Artist": "You want to create. +1 to checks involving arts of any kind.",
    "Engineer": "You want to build. +1 to checks involving crafts.",
    "Warrior": "You want to fight. +1 to combat checks.",
    "Politician": "You want to rule. +1 to checks involving mentally dominating others.",
    "Outlaw": "You want to live free from the law. +1 to checks to resist others.",
    "Empathy": "you can sense the feelings of others.",
    "Telepathy": "You can communicate with others with your mind.",
    "Mind Control": "You can control other people with your mind. Your Cunning check VS their Will check. A character that resists gains immunity to mind control.",
    "Telekinesis": "You can control objects with your mind.",
    "Energy Blasts": "You can blast things with your mind.",
    "Animal Control": "You can control animals with your mind. Intelligent animals can attempt a Will check VS your Cunning check, “dumb” animals can’t resist at all. Those who resist do not get immunity to future attempts.",
    "Troll-Eating Lusus": "for some reason no one ever wants to visit your hive.",
    "Lusus-Eating Lusus": "You probably shouldn’t leave them unattended when your friends are nearby.",
    "Two-Headed Lusus": "you know what they say about one head…",
    "Flying Lusus": "your lusus is capable of flight, regardless of whether they have wings.",
    "Psychic Lusus": "your lusus is intelligent enough to have psychic powers and the ability to use them. Roll 1d6 on the Psychic Powers table.",
    "Dragon Lusus": "You automatically have a Dragon for a lusus, no need to roll for one.",
    "Redblood": "Blood color is now red, regardless of original hemospectrum roll.",
    "Bifurcated": "your troll has two Dream Selves, and two opposing personalities. Both personalities identify as the same troll, however. With GM permission, the second personality can have different Charisma, Skill, Cunning, and/or Will stats, depending on how different they are. Second personality does not have the same mind control immunities as the first.",
    "Special Eyes": "your troll is able to channel their Godtier powers through their eyes. Losing their eyes will result in the loss of this ability. Choose how you want your eyes to look (different colors, multiple pupils, etc.). GM approval is needed for exactly which powers you can use with your eyes.",
    "STRONG": "Your troll is ridiculously strong. +2 to Athletics score when your strength is involved.",
    "Ghost": "your troll is already dead and is haunting their friends. You cannot physically interact with anything. If you have psychic powers, you can still use those. Trolls with psychic powers can sense your presence.",
    "Wings": "your troll is capable of flight and is also more attractive now. (No actual stat changes, but feel free to RP them that way)",
    "Seadweller": "+2 to athletics score when underwater"
  };

  BLOOD_COLORS = {
    'Rust': '#B7410E',
    'Bronze': '#CD7F32',
    'Gold': '#FFD700',
    'Red': 'red',
    'Olive': '#808000',
    'Jade': '#4A7B6F',
    'Teal': '#008080',
    'Cobalt': '#0047AB',
    'Indigo': '#4B0082',
    'Purple': 'purple',
    'Violet': '#8F00FF',
    'Fuschia': '#FF00FF'
  };

  chooseBlood = function() {
    var roll;
    roll = dice(1, 6) + dice(1, 6) * 10;
    if (roll <= 13) {
      return "Rust";
    } else if (roll <= 16) {
      return "Bronze";
    } else if (roll <= 25) {
      return "Gold";
    } else if (roll <= 26) {
      return "Red";
    } else if (roll <= 33) {
      return "Olive";
    } else if (roll <= 36) {
      return "Jade";
    } else if (roll <= 43) {
      return "Teal";
    } else if (roll <= 46) {
      return "Cobalt";
    } else if (roll <= 53) {
      return "Indigo";
    } else if (roll <= 56) {
      return "Purple";
    } else if (roll <= 65) {
      return "Violet";
    } else if (roll === 66) {
      return "Fuschia";
    }
  };

  chooseClass = function() {
    var roll;
    roll = dice(1, 6) + dice(1, 6) * 10;
    if (roll <= 13) {
      return "Maid";
    } else if (roll <= 16) {
      return "Page";
    } else if (roll <= 23) {
      return "Mage";
    } else if (roll <= 26) {
      return "Seer";
    } else if (roll <= 33) {
      return "Heir";
    } else if (roll <= 36) {
      return "Knight";
    } else if (roll <= 43) {
      return "Thief";
    } else if (roll <= 46) {
      return "Rogue";
    } else if (roll <= 53) {
      return "Prince/Witch";
    } else if (roll <= 56) {
      return "Bard/Sylph";
    } else if (roll <= 64) {
      return chooseClass();
    } else if (roll === 65) {
      return "Lord/Muse";
    } else if (roll === 66) {
      return "Choose your own!";
    }
  };

  chooseAspect = function() {
    var roll;
    roll = dice(1, 6) + dice(1, 6) * 10;
    if (roll <= 13) {
      return "Blood";
    } else if (roll <= 16) {
      return "Rage";
    } else if (roll <= 23) {
      return "Heart";
    } else if (roll <= 26) {
      return "Mind";
    } else if (roll <= 33) {
      return "Light";
    } else if (roll <= 36) {
      return "Void";
    } else if (roll <= 43) {
      return "Breath";
    } else if (roll <= 46) {
      return "Life";
    } else if (roll <= 53) {
      return "Hope";
    } else if (roll <= 56) {
      return "Doom";
    } else if (roll <= 63) {
      return "Time";
    } else if (roll === 66) {
      return "Space";
    }
  };

  chooseQuality = function() {
    var i;
    return ((function() {
      var _results;
      _results = [];
      for (i in QUALITIES) {
        _results.push(i);
      }
      return _results;
    })())[dice(1, 6) * dice(1, 6) - 1];
  };

  choosePersonality = function() {
    var i;
    return ((function() {
      var _results;
      _results = [];
      for (i in PERSONALITIES) {
        _results.push(i);
      }
      return _results;
    })())[dice(1, 6) - 1];
  };

  makeCharacter = function() {
    var ch, i, personality, quality, _i, _j, _ref, _ref1;
    ch = {};
    ch.athletics = Math.floor(dice(2, 6) / 3);
    ch.charisma = Math.floor(dice(2, 6) / 3);
    ch.skill = Math.floor(dice(2, 6) / 3);
    ch.cunning = Math.floor(dice(2, 6) / 3);
    ch.luck = Math.floor(dice(2, 6) / 3);
    ch.will = Math.floor(dice(2, 6) / 3);
    ch.mods = [];
    ch.personalities = [];
    for (i = _i = 0; _i <= 1; i = ++_i) {
      personality = choosePersonality();
      if (personality === "Childish") {
        ch.mods.push({
          luck: +1
        });
        ch.mods.push({
          athletics: -1
        });
      } else if (personality === "Bully") {
        ch.mods.push({
          cunning: +1
        });
        ch.mods.push({
          will: -1
        });
      } else if (personality === "Pure") {
        ch.mods.push({
          charisma: +1
        });
        ch.mods.push({
          cunning: -1
        });
      } else if (personality === "Cool") {
        ch.mods.push({
          skill: +1
        });
        ch.mods.push({
          charisma: -1
        });
      } else if (personality === "Adventurous") {
        ch.mods.push({
          athletics: +1
        });
        ch.mods.push({
          skill: -1
        });
      } else if (personality === "Leader") {
        ch.mods.push({
          will: +1
        });
        ch.mods.push({
          luck: -1
        });
      }
      ch.personalities.push(personality);
    }
    ch.qualities = [];
    for (i = _j = 0, _ref = parseInt($('#numQualities').val()) - 1; 0 <= _ref ? _j <= _ref : _j >= _ref; i = 0 <= _ref ? ++_j : --_j) {
      quality = chooseQuality();
      while (__indexOf.call(ch.qualities, quality) >= 0) {
        quality = chooseQuality();
      }
      if (quality === "Redblood") {
        ch.blood = "Red";
      }
      ch.qualities.push(quality);
    }
    ch.blood = chooseBlood();
    if ((_ref1 = ch.blood) === 'Violet' || _ref1 === 'Fuschia') {
      ch.qualities.push('Seadweller');
    }
    ch.klass = chooseClass();
    ch.aspect = chooseAspect();
    return ch;
  };

  main = function() {
    var attr, attrib, ch, mod, personality, quality, val, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    ch = makeCharacter();
    $(".character").show();
    for (attrib in ch) {
      $("." + attrib).text(ch[attrib]);
    }
    $('.personality').empty();
    _ref = ch.personalities;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      personality = _ref[_i];
      $('.personality').append("<li><strong>" + personality + "</strong> - " + PERSONALITIES[personality] + "</li>");
    }
    $('.special').empty();
    _ref1 = ch.qualities;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      quality = _ref1[_j];
      $('.special').append("<li><strong>" + quality + "</strong> - " + QUALITIES[quality] + "</li>");
    }
    _ref2 = ch.mods;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      mod = _ref2[_k];
      for (attr in mod) {
        val = mod[attr];
        if (val > 0) {
          val = '+' + val;
        }
        $("." + attr).html($("." + attr).html() + (" <strong>" + val + "</strong>"));
      }
    }
    return $('.blood').css('color', BLOOD_COLORS[ch.blood]);
  };

  $(function() {
    return $(".btn-success").click(main);
  });

}).call(this);