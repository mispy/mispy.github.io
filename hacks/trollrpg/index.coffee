dice = (n, m) ->
  val = 0
  for i in [0..n-1]
    val += Math.ceil(Math.random()*m)
  val

window.PERSONALITIES = {
  'Childish': "+1 Luck, -1 Athletics"
  'Bully': "+1 Cunning, -1 Will"
  'Pure': "+1 Charisma, -1 Cunning"
  'Cool': "+1 Skill, -1 Charisma"
  'Adventurous': "+1 Athletics, -1 Skill"
  'Leader': "+1 Will, -1 Luck"
}

QUALITIES = {
  # Personality
  "FLARPer": "you are already versed in combat, and likely have some good loot.",
  "Programmer": "you know the in and outs of coding. ~ATH is likely in your arsenal.",
  "Shipper": "you pay close attention to all of your friends and like to play matchmaker.",
  "Rule Follower": "whether it’s the law, the hemospectrum, or some other ruleset, you adhere to it religiously.",
  "Screw the Rules": "You don’t even care about the rules.",
  "Juggalo": "You belong to the clown cult. You wear makeup, drink the wicked elixir, and espouse equality for all in death."
  
  # Clothes
  "Jacket": "Extra pockets! Awesome.",
  "Glasses": "You most likely need these to see.",
  "Sunglasses": "Too cool for school.",
  "Red Clothes": "whatever you want is now red, sans your symbol.",
  "Inverted Colors": "wear your colors, with a black symbol",
  "FASHIONISTA": "wear whatever you want, whenever you want"

  # Profession
  "Scholar": "You want to learn. + 1 to checks involving learning.",
  "Artist": "You want to create. +1 to checks involving arts of any kind.",
  "Engineer": "You want to build. +1 to checks involving crafts.",
  "Warrior": "You want to fight. +1 to combat checks.",
  "Politician": "You want to rule. +1 to checks involving mentally dominating others.",
  "Outlaw": "You want to live free from the law. +1 to checks to resist others."
  
  # Powers
  "Empathy": "you can sense the feelings of others.",
  "Telepathy": "You can communicate with others with your mind.",
  "Mind Control": "You can control other people with your mind. Your Cunning check VS their Will check. A character that resists gains immunity to mind control.",
  "Telekinesis": "You can control objects with your mind.",
  "Energy Blasts": "You can blast things with your mind.",
  "Animal Control": "You can control animals with your mind. Intelligent animals can attempt a Will check VS your Cunning check, “dumb” animals can’t resist at all. Those who resist do not get immunity to future attempts."

  # Lusus
  "Troll-Eating Lusus": "for some reason no one ever wants to visit your hive.",
  "Lusus-Eating Lusus": "You probably shouldn’t leave them unattended when your friends are nearby.",
  "Two-Headed Lusus": "you know what they say about one head…",
  "Flying Lusus": "your lusus is capable of flight, regardless of whether they have wings.",
  "Psychic Lusus": "your lusus is intelligent enough to have psychic powers and the ability to use them. Roll 1d6 on the Psychic Powers table.",
  "Dragon Lusus": "You automatically have a Dragon for a lusus, no need to roll for one."

  # Unique
  "Redblood": "Blood color is now red, regardless of original hemospectrum roll.",
  "Bifurcated": "your troll has two Dream Selves, and two opposing personalities. Both personalities identify as the same troll, however. With GM permission, the second personality can have different Charisma, Skill, Cunning, and/or Will stats, depending on how different they are. Second personality does not have the same mind control immunities as the first.",
  "Special Eyes": "your troll is able to channel their Godtier powers through their eyes. Losing their eyes will result in the loss of this ability. Choose how you want your eyes to look (different colors, multiple pupils, etc.). GM approval is needed for exactly which powers you can use with your eyes.",
  "STRONG": "Your troll is ridiculously strong. +2 to Athletics score when your strength is involved.",
  "Ghost": "your troll is already dead and is haunting their friends. You cannot physically interact with anything. If you have psychic powers, you can still use those. Trolls with psychic powers can sense your presence.",
  "Wings": "your troll is capable of flight and is also more attractive now. (No actual stat changes, but feel free to RP them that way)"

  # Unrollable!
  "Seadweller": "+2 to athletics score when underwater"
}

BLOOD_COLORS = {
  'Rust': '#B7410E'
  'Bronze': '#CD7F32'
  'Gold': '#FFD700'
  'Red': 'red'
  'Olive': '#808000'
  'Jade': '#4A7B6F'
  'Teal': '#008080'
  'Cobalt': '#0047AB'
  'Indigo': '#4B0082'
  'Purple': 'purple'
  'Violet': '#8F00FF'
  'Fuschia': '#FF00FF'
}

chooseBlood = ->
  roll = dice(1, 6) + dice(1, 6) * 10
  if roll <= 13
    "Rust"
  else if roll <= 16
    "Bronze"
  else if roll <= 25
    "Gold"
  else if roll <= 26
    "Red"
  else if roll <= 33
    "Olive"
  else if roll <= 36
    "Jade"
  else if roll <= 43
    "Teal"
  else if roll <= 46
    "Cobalt"
  else if roll <= 53
    "Indigo"
  else if roll <= 56
    "Purple"
  else if roll <= 65
    "Violet"
  else if roll == 66
    "Fuschia"

chooseClass = ->
  roll = dice(1, 6) + dice(1, 6) * 10
  if roll <= 13
     "Maid"
  else if roll <= 16
     "Page"
  else if roll <= 23
     "Mage"
  else if roll <= 26
     "Seer"
  else if roll <= 33
     "Heir"
  else if roll <= 36
     "Knight"
  else if roll <= 43
     "Thief"
  else if roll <= 46
     "Rogue"
  else if roll <= 53
     "Prince/Witch"
  else if roll <= 56
     "Bard/Sylph"
  else if roll <= 64
     chooseClass()
  else if roll is 65
     "Lord/Muse"
  else if roll == 66
     "Choose your own!"

chooseAspect = ->
  roll = dice(1, 6) + dice(1, 6) * 10
  if roll <= 13
    "Blood"
  else if roll <= 16
    "Rage"
  else if roll <= 23
    "Heart"
  else if roll <= 26
    "Mind"
  else if roll <= 33
    "Light"
  else if roll <= 36
    "Void"
  else if roll <= 43
    "Breath"
  else if roll <= 46
    "Life"
  else if roll <= 53
    "Hope"
  else if roll <= 56
    "Doom"
  else if roll <= 63
    "Time"
  else if roll == 66
    "Space"

chooseQuality = ->
  (i for i of QUALITIES)[dice(1,6)*dice(1,6) - 1]

choosePersonality = ->
  (i for i of PERSONALITIES)[dice(1,6)-1]

makeCharacter = ->
  ch = {}
  ch.athletics = Math.floor(dice(2, 6) / 3)
  ch.charisma = Math.floor(dice(2, 6) / 3)
  ch.skill = Math.floor(dice(2, 6) / 3)
  ch.cunning = Math.floor(dice(2, 6) / 3)
  ch.luck = Math.floor(dice(2, 6) / 3)
  ch.will = Math.floor(dice(2, 6) / 3)

  ch.mods = []

  ch.personalities = []
  for i in [0..1]
    personality = choosePersonality()
    if personality == "Childish"
      ch.mods.push({ luck: +1 })
      ch.mods.push({ athletics: -1 })
    else if personality == "Bully"
      ch.mods.push({ cunning: +1 })
      ch.mods.push({ will: -1 })
    else if personality == "Pure"
      ch.mods.push({ charisma: +1 })
      ch.mods.push({ cunning: -1 })
    else if personality == "Cool"
      ch.mods.push({ skill: +1 })
      ch.mods.push({ charisma: -1 })
    else if personality == "Adventurous"
      ch.mods.push({ athletics: +1 })
      ch.mods.push({ skill: -1 })
    else if personality == "Leader"
      ch.mods.push({ will: +1 })
      ch.mods.push({ luck: -1 })
    ch.personalities.push(personality)

  ch.qualities = []

  for i in [0..parseInt($('#numQualities').val())-1]
    quality = chooseQuality()
    while quality in ch.qualities # Prevent duplicates
      quality = chooseQuality()
    if quality == "Redblood"
      ch.blood = "Red"
    ch.qualities.push quality

  ch.blood = chooseBlood()
  if ch.blood in ['Violet', 'Fuschia']
    ch.qualities.push('Seadweller')


  ch.klass = chooseClass()
  ch.aspect = chooseAspect()
  ch

main = ->
  ch = makeCharacter()
  $(".character").show()
  for attrib of ch
    $("." + attrib).text ch[attrib]

  $('.personality').empty()
  for personality in ch.personalities
    $('.personality').append "<li><strong>#{personality}</strong> - #{PERSONALITIES[personality]}</li>"

  $('.special').empty()
  for quality in ch.qualities
    $('.special').append "<li><strong>#{quality}</strong> - #{QUALITIES[quality]}</li>"

  for mod in ch.mods
    for attr of mod
      val = mod[attr]
      val = '+' + val if val > 0
      $(".#{attr}").html($(".#{attr}").html() + " <strong>#{val}</strong>")

  $('.blood').css('color', BLOOD_COLORS[ch.blood])


$ ->
  $(".btn-success").click main

