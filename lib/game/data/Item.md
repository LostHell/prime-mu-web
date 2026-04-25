# Item Database Reference

## Column Glossary

### Universal Columns (all categories)

| Column   | Meaning                                                    |
| -------- | ---------------------------------------------------------- |
| `#`      | Item index within the category                             |
| `Slot`   | Equipment slot — see table below                           |
| `Skill`  | Skill ID required to equip (0 = none)                      |
| `W×H`    | Inventory grid size (width × height)                       |
| `Serial` | Can have serial number (1 = yes)                           |
| `Option` | Can have magic options/suffixes (1 = yes)                  |
| `Drop`   | Can drop from monsters (1 = yes, 0 = special/quest only)   |
| `DW`     | Dark Wizard can use (0 = no, 1 = yes, 2 = class-exclusive) |
| `DK`     | Dark Knight can use                                        |
| `ELF`    | Elf can use                                                |
| `MG`     | Magic Gladiator can use                                    |

### Equipment Slots

| Value | Slot                        |
| ----- | --------------------------- |
| `-1`  | No slot (consumable / misc) |
| `0`   | Right hand (weapon)         |
| `1`   | Left hand (off-hand / bow)  |
| `2`   | Helmet                      |
| `3`   | Armor                       |
| `4`   | Pants                       |
| `5`   | Gloves                      |
| `6`   | Boots                       |
| `7`   | Wings                       |
| `8`   | Pet                         |
| `9`   | Pendant                     |
| `10`  | Ring                        |

### Stat Abbreviations

| Abbreviation | Meaning                                                                    |
| ------------ | -------------------------------------------------------------------------- |
| `Lvl`        | Item base level                                                            |
| `Dmg Min`    | Minimum damage                                                             |
| `Dmg Max`    | Maximum damage                                                             |
| `Atk Spd`    | Attack speed                                                               |
| `Dur`        | Durability                                                                 |
| `Magi Dur`   | Magic durability                                                           |
| `Magi Dmg`   | Magic damage                                                               |
| `Def`        | Defense                                                                    |
| `Def Rate`   | Defense rate                                                               |
| `Magi Def`   | Magic defense                                                              |
| `Walk Spd`   | Walk speed bonus                                                           |
| `Req Lvl`    | Required character level                                                   |
| `Req Str`    | Required strength                                                          |
| `Req Agi`    | Required agility                                                           |
| `Req Ene`    | Required energy                                                            |
| `Req Vit`    | Required vitality                                                          |
| `Atrib`      | Attribute type (1 = standard weapon, 2 = bow, 3 = staff, 4 = armor/shield) |

---

## Group 0 — Swords

Columns: `#`, `Name`, `Lvl`, `Dmg Min`, `Dmg Max`, `Atk Spd`, `Dur`, `Magi Dmg`, `Req Str`, `Req Agi`, `Req Ene`, `DW`, `DK`, `ELF`, `MG`

| #   | Name                      | Lvl | Dmg Min | Dmg Max | Atk Spd | Dur | Magi Dmg | Req Str | Req Agi | Req Ene | DW  | DK  | ELF | MG  |
| --- | ------------------------- | --- | ------- | ------- | ------- | --- | -------- | ------- | ------- | ------- | --- | --- | --- | --- |
| 0   | Kris                      | 6   | 6       | 11      | 50      | 20  | 0        | 40      | 40      | 0       | ✓   | ✓   | ✓   | ✓   |
| 1   | Short Sword               | 3   | 3       | 7       | 20      | 22  | 0        | 60      | 0       | 0       | ✓   | ✓   | ✓   | ✓   |
| 2   | Rapier                    | 9   | 9       | 15      | 40      | 23  | 0        | 50      | 40      | 0       | ✓   | —   | ✓   | ✓   |
| 3   | Katana                    | 16  | 16      | 26      | 35      | 27  | 0        | 80      | 40      | 0       | ✓   | —   | ✓   | —   |
| 4   | Sword of Assassin         | 12  | 12      | 18      | 30      | 24  | 0        | 60      | 40      | 0       | ✓   | —   | ✓   | —   |
| 5   | Blade                     | 36  | 36      | 47      | 30      | 39  | 0        | 80      | 50      | 0       | ✓   | ✓   | ✓   | ✓   |
| 6   | Gladius                   | 20  | 20      | 30      | 20      | 30  | 0        | 110     | 0       | 0       | ✓   | —   | ✓   | ✓   |
| 7   | Falchion                  | 24  | 24      | 34      | 25      | 34  | 0        | 120     | 0       | 0       | ✓   | —   | ✓   | —   |
| 8   | Serpent Sword             | 30  | 30      | 40      | 20      | 36  | 0        | 130     | 0       | 0       | ✓   | —   | ✓   | —   |
| 9   | Sword of Salamander       | 32  | 32      | 46      | 30      | 40  | 0        | 103     | 0       | 0       | ✓   | —   | ✓   | —   |
| 10  | Light Saber               | 40  | 47      | 61      | 25      | 50  | 0        | 80      | 60      | 0       | ✓   | —   | ✓   | ✓   |
| 11  | Legendary Sword           | 44  | 56      | 72      | 20      | 54  | 0        | 120     | 0       | 0       | ✓   | —   | ✓   | —   |
| 12  | Heliacal Sword            | 56  | 73      | 98      | 25      | 66  | 0        | 140     | 0       | 0       | ✓   | —   | ✓   | —   |
| 13  | Double Blade              | 48  | 48      | 56      | 30      | 43  | 0        | 70      | 70      | 0       | ✓   | —   | ✓   | ✓   |
| 14  | Lightning Sword           | 59  | 59      | 67      | 30      | 50  | 0        | 90      | 50      | 0       | ✓   | —   | ✓   | ✓   |
| 15  | Giant Sword               | 52  | 60      | 85      | 20      | 60  | 0        | 140     | 0       | 0       | ✓   | —   | ✓   | —   |
| 16  | Sword of Destruction      | 82  | 82      | 90      | 35      | 84  | 0        | 160     | 60      | 0       | ✓   | —   | ✓   | —   |
| 17  | Dark Breaker              | 104 | 128     | 153     | 40      | 89  | 0        | 180     | 50      | 0       | —   | —   | ★   | —   |
| 18  | Thunder Blade             | 105 | 140     | 168     | 40      | 86  | 0        | 180     | 50      | 0       | —   | —   | —   | ✓   |
| 19  | Divine Sword of Archangel | 86  | 120     | 130     | 35      | 168 | 0        | 140     | 50      | 0       | —   | —   | ✓   | ✓   |
| 20  | Knight Blade              | 140 | 107     | 115     | 35      | 90  | 0        | 116     | 38      | 0       | —   | —   | ★   | —   |
| 31  | Rune Blade                | 100 | 104     | 130     | 35      | 93  | 104      | 135     | 62      | 9       | —   | —   | —   | ✓   |

> ★ = class-exclusive version (value = 2)

---

## Group 1 — Axes

| #   | Name         | Lvl | Dmg Min | Dmg Max | Atk Spd | Dur | Req Str | Req Agi | DW  | DK  | ELF | MG  |
| --- | ------------ | --- | ------- | ------- | ------- | --- | ------- | ------- | --- | --- | --- | --- |
| 0   | Small Axe    | 1   | 1       | 6       | 20      | 18  | 50      | 0       | ✓   | ✓   | ✓   | ✓   |
| 1   | Hand Axe     | 4   | 4       | 9       | 30      | 20  | 70      | 0       | ✓   | ✓   | ✓   | ✓   |
| 2   | Double Axe   | 14  | 14      | 24      | 20      | 26  | 90      | 0       | ✓   | —   | ✓   | ✓   |
| 3   | Tomahawk     | 18  | 18      | 28      | 30      | 28  | 100     | 0       | ✓   | —   | ✓   | ✓   |
| 4   | Elven Axe    | 26  | 26      | 38      | 40      | 32  | 50      | 70      | ✓   | ✓   | —   | ✓   |
| 5   | Battle Axe   | 30  | 36      | 44      | 20      | 36  | 120     | 0       | ✓   | —   | ✓   | ✓   |
| 6   | Nikea Axe    | 34  | 38      | 50      | 30      | 44  | 130     | 0       | ✓   | —   | ✓   | ✓   |
| 7   | Larkan Axe   | 46  | 54      | 67      | 25      | 55  | 140     | 0       | ✓   | —   | ✓   | —   |
| 8   | Crescent Axe | 54  | 69      | 89      | 30      | 65  | 100     | 40      | ✓   | ✓   | ✓   | ✓   |

---

## Group 2 — Maces

| #   | Name                 | Lvl | Dmg Min | Dmg Max | Atk Spd | Dur | Req Str | Req Agi | DW  | DK  | ELF | MG  |
| --- | -------------------- | --- | ------- | ------- | ------- | --- | ------- | ------- | --- | --- | --- | --- |
| 0   | Mace                 | 7   | 7       | 13      | 15      | 21  | 100     | 0       | —   | ✓   | —   | ✓   |
| 1   | Morning Star         | 13  | 13      | 22      | 15      | 25  | 100     | 0       | —   | ✓   | —   | ✓   |
| 2   | Flail                | 22  | 22      | 32      | 15      | 32  | 80      | 50      | —   | ✓   | —   | ✓   |
| 3   | Great Hammer         | 38  | 45      | 56      | 15      | 50  | 150     | 0       | —   | ✓   | —   | ✓   |
| 4   | Crystal Morning Star | 66  | 78      | 107     | 30      | 72  | 130     | 0       | ✓   | ✓   | ✓   | ✓   |
| 5   | Crystal Sword        | 72  | 89      | 120     | 40      | 76  | 130     | 70      | ✓   | ✓   | ✓   | ✓   |
| 6   | Chaos Dragon Axe     | 75  | 102     | 130     | 35      | 80  | 140     | 50      | —   | ✓   | —   | ✓   |
| 7   | Elemental Mace       | 90  | 62      | 80      | 50      | 50  | 15      | 42      | —   | —   | ★   | —   |
| 8   | Mace of the King     | 40  | 40      | 51      | 20      | 40  | 120     | 0       | ✓   | ✓   | ✓   | ✓   |

---

## Group 3 — Spears

| #   | Name           | Lvl | Dmg Min | Dmg Max | Atk Spd | Dur | Req Str | Req Agi | DW  | DK  | ELF | MG  |
| --- | -------------- | --- | ------- | ------- | ------- | --- | ------- | ------- | --- | --- | --- | --- |
| 0   | Light Spear    | 42  | 50      | 63      | 25      | 56  | 60      | 70      | —   | ✓   | ✓   | ✓   |
| 1   | Spear          | 23  | 30      | 41      | 30      | 42  | 70      | 50      | —   | ✓   | ✓   | ✓   |
| 2   | Dragon Lance   | 15  | 21      | 33      | 30      | 34  | 70      | 50      | —   | ✓   | ✓   | ✓   |
| 3   | Giant Trident  | 29  | 35      | 43      | 25      | 44  | 90      | 30      | —   | ✓   | ✓   | ✓   |
| 4   | Serpent Spear  | 46  | 58      | 80      | 20      | 58  | 90      | 30      | —   | ✓   | ✓   | ✓   |
| 5   | Double Poleaxe | 13  | 19      | 31      | 30      | 38  | 70      | 50      | —   | ✓   | ✓   | ✓   |
| 6   | Halberd        | 19  | 25      | 35      | 30      | 40  | 70      | 50      | —   | ✓   | ✓   | ✓   |
| 7   | Berdysh        | 37  | 42      | 54      | 30      | 54  | 80      | 50      | —   | ✓   | ✓   | ✓   |
| 8   | Great Scythe   | 54  | 71      | 92      | 25      | 68  | 90      | 50      | —   | ✓   | ✓   | ✓   |
| 9   | Bill of Balrog | 63  | 76      | 102     | 25      | 74  | 80      | 50      | —   | ✓   | ✓   | ✓   |
| 10  | Dragon Spear   | 92  | 112     | 140     | 35      | 85  | 170     | 60      | —   | —   | ★   | —   |

---

## Group 4 — Bows & Crossbows

| #   | Name                         | Slot | Lvl | Dmg Min | Dmg Max | Atk Spd | Dur | Req Str | Req Agi | DW  | DK  | ELF | MG  |
| --- | ---------------------------- | ---- | --- | ------- | ------- | ------- | --- | ------- | ------- | --- | --- | --- | --- |
| 0   | Short Bow                    | LH   | 2   | 3       | 5       | 30      | 20  | 20      | 80      | —   | —   | ✓   | —   |
| 1   | Bow                          | LH   | 8   | 9       | 13      | 30      | 24  | 30      | 90      | —   | —   | ✓   | —   |
| 2   | Elven Bow                    | LH   | 16  | 17      | 24      | 30      | 28  | 30      | 90      | —   | —   | ✓   | —   |
| 3   | Battle Bow                   | LH   | 26  | 28      | 37      | 30      | 36  | 30      | 90      | —   | —   | ✓   | —   |
| 4   | Tiger Bow                    | LH   | 40  | 42      | 52      | 30      | 43  | 30      | 100     | —   | —   | ✓   | —   |
| 5   | Silver Bow                   | LH   | 56  | 59      | 71      | 40      | 48  | 30      | 100     | —   | —   | ✓   | —   |
| 6   | Chaos Nature Bow             | LH   | 75  | 88      | 106     | 35      | 68  | 40      | 150     | —   | —   | ✓   | —   |
| 7   | Bolts (ammo)                 | LH   | —   | —       | —       | —       | —   | —       | —       | —   | —   | ✓   | —   |
| 8   | Crossbow                     | RH   | 4   | 5       | 8       | 40      | 22  | 20      | 90      | —   | —   | ✓   | —   |
| 9   | Golden Crossbow              | RH   | 12  | 13      | 19      | 40      | 26  | 30      | 90      | —   | —   | ✓   | —   |
| 10  | Arquebus                     | RH   | 20  | 22      | 30      | 40      | 31  | 30      | 90      | —   | —   | ✓   | —   |
| 11  | Light Crossbow               | RH   | 32  | 35      | 44      | 40      | 40  | 30      | 90      | —   | —   | ✓   | —   |
| 12  | Serpent Crossbow             | RH   | 48  | 50      | 61      | 40      | 45  | 30      | 100     | —   | —   | ✓   | —   |
| 13  | Bluewing Crossbow            | RH   | 68  | 68      | 82      | 40      | 56  | 40      | 110     | —   | —   | ✓   | —   |
| 14  | Aquagold Crossbow            | RH   | 72  | 78      | 92      | 30      | 60  | 50      | 130     | —   | —   | ✓   | —   |
| 15  | Arrows (ammo)                | RH   | —   | —       | —       | —       | —   | —       | —       | —   | —   | ✓   | —   |
| 16  | Saint Crossbow               | RH   | 84  | 102     | 127     | 35      | 72  | 50      | 160     | —   | —   | ✓   | —   |
| 17  | Celestial Bow                | LH   | 92  | 127     | 155     | 35      | 76  | 54      | 198     | —   | —   | ★   | —   |
| 18  | Divine Crossbow of Archangel | RH   | 100 | 144     | 166     | 35      | 200 | 40      | 110     | —   | —   | ✓   | —   |

> LH = Left Hand slot (1), RH = Right Hand slot (0)

---

## Group 5 — Staffs

Staffs deal **magic damage** (`Magi Dmg`) instead of physical damage. `Dur` = 0 (staffs use `Magi Dur`).

| #   | Name                      | Lvl | Dmg Min | Dmg Max | Atk Spd | Magi Dur | Magi Dmg | Req Str | Req Agi | Req Ene | DW  | DK  | ELF | MG  |
| --- | ------------------------- | --- | ------- | ------- | ------- | -------- | -------- | ------- | ------- | ------- | --- | --- | --- | --- |
| 0   | Skull Staff               | 6   | 3       | 4       | 20      | 20       | 6        | 40      | 0       | 0       | ✓   | —   | —   | ✓   |
| 1   | Angelic Staff             | 18  | 10      | 12      | 25      | 38       | 20       | 50      | 0       | 0       | ✓   | —   | —   | ✓   |
| 2   | Serpent Staff             | 30  | 17      | 18      | 25      | 50       | 34       | 50      | 0       | 0       | ✓   | —   | —   | ✓   |
| 3   | Thunder Staff             | 42  | 23      | 25      | 25      | 60       | 46       | 40      | 10      | 0       | ✓   | —   | —   | ✓   |
| 4   | Gorgon Staff              | 52  | 29      | 32      | 25      | 65       | 58       | 50      | 0       | 0       | ✓   | —   | —   | ✓   |
| 5   | Legendary Staff           | 59  | 29      | 31      | 25      | 66       | 59       | 50      | 0       | 0       | ✓   | —   | —   | ✓   |
| 6   | Staff of Resurrection     | 70  | 35      | 39      | 25      | 70       | 70       | 60      | 10      | 0       | ✓   | —   | —   | ✓   |
| 7   | Chaos Lightning Staff     | 75  | 47      | 48      | 30      | 70       | 94       | 60      | 10      | 0       | ✓   | —   | —   | ✓   |
| 8   | Staff of Destruction      | 90  | 50      | 54      | 30      | 85       | 101      | 60      | 10      | 0       | ✓   | —   | —   | ✓   |
| 9   | Dragon Soul Staff         | 100 | 46      | 48      | 30      | 91       | 92       | 52      | 16      | 0       | ★   | —   | —   | —   |
| 10  | Divine Staff of Archangel | 104 | 53      | 55      | 20      | 182      | 106      | 36      | 4       | 0       | ✓   | —   | —   | ✓   |

---

## Group 6 — Shields

| #   | Name                 | Lvl | Def | Def Rate | Dur | Req Str | Req Agi | Req Ene | DW  | DK  | ELF | MG  |
| --- | -------------------- | --- | --- | -------- | --- | ------- | ------- | ------- | --- | --- | --- | --- |
| 0   | Small Shield         | 3   | 1   | 3        | 22  | 70      | 0       | 0       | ✓   | ✓   | ✓   | ✓   |
| 1   | Horn Shield          | 9   | 3   | 9        | 28  | 100     | 0       | 0       | —   | ✓   | —   | ✓   |
| 2   | Kite Shield          | 12  | 4   | 12       | 32  | 110     | 0       | 0       | —   | ✓   | —   | ✓   |
| 3   | Elven Shield         | 21  | 8   | 21       | 36  | 30      | 100     | 0       | —   | —   | ✓   | —   |
| 4   | Buckler              | 6   | 2   | 6        | 24  | 80      | 0       | 0       | ✓   | ✓   | ✓   | ✓   |
| 5   | Dragon Slayer Shield | 35  | 10  | 36       | 44  | 100     | 40      | 0       | —   | ✓   | —   | ✓   |
| 6   | Skull Shield         | 15  | 5   | 15       | 34  | 110     | 0       | 0       | ✓   | ✓   | ✓   | ✓   |
| 7   | Spiked Shield        | 30  | 9   | 30       | 40  | 130     | 0       | 0       | —   | ✓   | —   | ✓   |
| 8   | Tower Shield         | 40  | 11  | 40       | 46  | 130     | 0       | 0       | —   | ✓   | ✓   | ✓   |
| 9   | Plate Shield         | 25  | 8   | 25       | 38  | 120     | 0       | 0       | —   | ✓   | —   | ✓   |
| 10  | Large Round Shield   | 18  | 6   | 18       | 35  | 120     | 0       | 0       | —   | ✓   | —   | ✓   |
| 11  | Serpent Shield       | 45  | 12  | 45       | 48  | 130     | 0       | 0       | —   | ✓   | ✓   | ✓   |
| 12  | Bronze Shield        | 54  | 13  | 54       | 52  | 140     | 0       | 0       | —   | ✓   | —   | ✓   |
| 13  | Dragon Shield        | 60  | 14  | 60       | 60  | 120     | 40      | 0       | —   | ✓   | —   | ✓   |
| 14  | Legendary Shield     | 48  | 7   | 48       | 50  | 90      | 25      | 0       | ✓   | —   | ✓   | ✓   |
| 15  | Grand Soul Shield    | 74  | 12  | 55       | 55  | 70      | 23      | 0       | ★   | —   | —   | —   |
| 16  | Elemental Shield     | 66  | 11  | 28       | 51  | 30      | 60      | 30      | —   | —   | ★   | —   |

---

## Group 7 — Helmets

| #   | Name              | Lvl | Def | Magi Def | Dur | Req Str | Req Agi | DW  | DK  | ELF | MG  |
| --- | ----------------- | --- | --- | -------- | --- | ------- | ------- | --- | --- | --- | --- |
| 0   | Bronze Helm       | 16  | 9   | 0        | 34  | 80      | 20      | —   | ✓   | —   | —   |
| 1   | Dragon Helm       | 57  | 24  | 0        | 68  | 120     | 30      | —   | ✓   | —   | —   |
| 2   | Pad Helm          | 5   | 4   | 0        | 28  | 20      | 0       | ✓   | —   | —   | —   |
| 3   | Legendary Helm    | 50  | 18  | 0        | 42  | 30      | 0       | ✓   | —   | —   | —   |
| 4   | Bone Helm         | 18  | 9   | 0        | 30  | 30      | 0       | ✓   | —   | —   | —   |
| 5   | Leather Helm      | 6   | 5   | 0        | 30  | 80      | 0       | —   | ✓   | —   | —   |
| 6   | Scale Helm        | 26  | 12  | 0        | 40  | 110     | 0       | —   | ✓   | —   | —   |
| 7   | Sphinx Helm       | 32  | 13  | 0        | 36  | 30      | 0       | ✓   | —   | —   | —   |
| 8   | Brass Helm        | 36  | 17  | 0        | 44  | 100     | 30      | —   | ✓   | —   | —   |
| 9   | Plate Helm        | 46  | 20  | 0        | 50  | 130     | 0       | —   | ✓   | —   | —   |
| 10  | Vine Helm         | 6   | 4   | 0        | 22  | 30      | 60      | —   | —   | ✓   | —   |
| 11  | Silk Helm         | 16  | 8   | 0        | 26  | 30      | 70      | —   | —   | ✓   | —   |
| 12  | Wind Helm         | 28  | 12  | 0        | 32  | 30      | 80      | —   | —   | ✓   | —   |
| 13  | Spirit Helm       | 40  | 16  | 0        | 38  | 40      | 80      | —   | —   | ✓   | —   |
| 14  | Guardian Helm     | 53  | 23  | 0        | 45  | 40      | 80      | —   | —   | ✓   | —   |
| 16  | Black Dragon Helm | 82  | 30  | 0        | 74  | 170     | 60      | —   | ✓   | —   | —   |
| 17  | Dark Phoenix Helm | 92  | 43  | 0        | 80  | 205     | 62      | —   | ★   | —   | —   |
| 18  | Grand Soul Helm   | 81  | 27  | 0        | 67  | 59      | 20      | ★   | —   | —   | —   |
| 19  | Divine Helm       | 85  | 37  | 0        | 74  | 50      | 110     | —   | —   | ★   | —   |
| 21  | Great Dragon Helm | 104 | 53  | 0        | 86  | 200     | 58      | —   | ★   | —   | —   |

---

## Group 8 — Armors

| #   | Name               | Lvl | Def | Magi Def | Dur | Req Str | Req Agi | DW  | DK  | ELF | MG  |
| --- | ------------------ | --- | --- | -------- | --- | ------- | ------- | --- | --- | --- | --- |
| 0   | Bronze Armor       | 18  | 14  | 0        | 34  | 80      | 20      | —   | ✓   | —   | ✓   |
| 1   | Dragon Armor       | 59  | 37  | 0        | 68  | 120     | 30      | —   | ✓   | —   | ✓   |
| 2   | Pad Armor          | 10  | 7   | 0        | 28  | 30      | 0       | ✓   | —   | —   | ✓   |
| 3   | Legendary Armor    | 56  | 22  | 0        | 42  | 40      | 0       | ✓   | —   | —   | ✓   |
| 4   | Bone Armor         | 22  | 13  | 0        | 30  | 40      | 0       | ✓   | —   | —   | ✓   |
| 5   | Leather Armor      | 10  | 10  | 0        | 30  | 80      | 0       | —   | ✓   | —   | ✓   |
| 6   | Scale Armor        | 28  | 18  | 0        | 40  | 110     | 0       | —   | ✓   | —   | ✓   |
| 7   | Sphinx Armor       | 38  | 17  | 0        | 36  | 40      | 0       | ✓   | —   | —   | ✓   |
| 8   | Brass Armor        | 38  | 22  | 0        | 44  | 100     | 30      | —   | ✓   | —   | ✓   |
| 9   | Plate Armor        | 48  | 30  | 0        | 50  | 130     | 0       | —   | ✓   | —   | ✓   |
| 10  | Vine Armor         | 10  | 8   | 0        | 22  | 30      | 60      | —   | —   | ✓   | —   |
| 11  | Silk Armor         | 20  | 12  | 0        | 26  | 30      | 70      | —   | —   | ✓   | —   |
| 12  | Wind Armor         | 32  | 16  | 0        | 32  | 30      | 80      | —   | —   | ✓   | —   |
| 13  | Spirit Armor       | 44  | 21  | 0        | 38  | 40      | 80      | —   | —   | ✓   | —   |
| 14  | Guardian Armor     | 57  | 29  | 0        | 45  | 40      | 80      | —   | —   | ✓   | —   |
| 15  | Storm Crow Armor   | 80  | 44  | 0        | 80  | 150     | 70      | —   | —   | —   | ✓   |
| 16  | Black Dragon Armor | 90  | 48  | 0        | 74  | 170     | 60      | —   | ✓   | —   | —   |
| 17  | Dark Phoenix Armor | 100 | 63  | 0        | 80  | 214     | 65      | —   | ★   | —   | —   |
| 18  | Grand Soul Armor   | 91  | 33  | 0        | 67  | 59      | 20      | ★   | —   | —   | —   |
| 19  | Divine Armor       | 92  | 44  | 0        | 74  | 50      | 110     | —   | —   | ★   | —   |
| 20  | Thunder Hawk Armor | 107 | 60  | 0        | 82  | 170     | 70      | —   | —   | —   | ✓   |
| 21  | Great Dragon Armor | 126 | 75  | 0        | 86  | 200     | 58      | —   | ★   | —   | —   |

---

## Group 9 — Pants

| #   | Name               | Lvl | Def | Magi Def | Dur | Req Str | Req Agi | DW  | DK  | ELF | MG  |
| --- | ------------------ | --- | --- | -------- | --- | ------- | ------- | --- | --- | --- | --- |
| 0   | Bronze Pants       | 15  | 10  | 0        | 34  | 80      | 20      | —   | ✓   | —   | ✓   |
| 1   | Dragon Pants       | 55  | 26  | 0        | 68  | 120     | 30      | —   | ✓   | —   | ✓   |
| 2   | Pad Pants          | 8   | 5   | 0        | 28  | 30      | 0       | ✓   | —   | —   | ✓   |
| 3   | Legendary Pants    | 53  | 20  | 0        | 42  | 40      | 0       | ✓   | —   | —   | ✓   |
| 4   | Bone Pants         | 20  | 10  | 0        | 30  | 40      | 0       | ✓   | —   | —   | ✓   |
| 5   | Leather Pants      | 8   | 7   | 0        | 30  | 80      | 0       | —   | ✓   | —   | ✓   |
| 6   | Scale Pants        | 25  | 14  | 0        | 40  | 110     | 0       | —   | ✓   | —   | ✓   |
| 7   | Sphinx Pants       | 34  | 15  | 0        | 36  | 40      | 0       | ✓   | —   | —   | ✓   |
| 8   | Brass Pants        | 35  | 18  | 0        | 44  | 100     | 30      | —   | ✓   | —   | ✓   |
| 9   | Plate Pants        | 45  | 22  | 0        | 50  | 130     | 0       | —   | ✓   | —   | ✓   |
| 10  | Vine Pants         | 8   | 6   | 0        | 22  | 30      | 60      | —   | —   | ✓   | —   |
| 11  | Silk Pants         | 18  | 10  | 0        | 26  | 30      | 70      | —   | —   | ✓   | —   |
| 12  | Wind Pants         | 30  | 14  | 0        | 32  | 30      | 80      | —   | —   | ✓   | —   |
| 13  | Spirit Pants       | 42  | 18  | 0        | 38  | 40      | 80      | —   | —   | ✓   | —   |
| 14  | Guardian Pants     | 54  | 25  | 0        | 45  | 40      | 80      | —   | —   | ✓   | —   |
| 15  | Storm Crow Pants   | 74  | 34  | 0        | 80  | 150     | 70      | —   | —   | —   | ✓   |
| 16  | Black Dragon Pants | 84  | 40  | 0        | 74  | 170     | 60      | —   | ✓   | —   | —   |
| 17  | Dark Phoenix Pants | 96  | 54  | 0        | 80  | 207     | 63      | —   | ★   | —   | —   |
| 18  | Grand Soul Pants   | 86  | 30  | 0        | 67  | 59      | 20      | ★   | —   | —   | —   |
| 19  | Divine Pants       | 88  | 39  | 0        | 74  | 50      | 110     | —   | —   | ★   | —   |
| 20  | Thunder Hawk Pants | 99  | 49  | 0        | 82  | 150     | 70      | —   | —   | —   | ✓   |
| 21  | Great Dragon Pants | 113 | 65  | 0        | 86  | 200     | 58      | —   | ★   | —   | —   |

---

## Group 10 — Gloves

`Atk Spd` bonus on gloves increases your attack speed.

| #   | Name                | Lvl | Def | Atk Spd | Dur | Req Str | Req Agi | DW  | DK  | ELF | MG  |
| --- | ------------------- | --- | --- | ------- | --- | ------- | ------- | --- | --- | --- | --- |
| 0   | Bronze Gloves       | 13  | 4   | 0       | 34  | 80      | 20      | —   | ✓   | —   | ✓   |
| 1   | Dragon Gloves       | 52  | 14  | 0       | 68  | 120     | 30      | —   | ✓   | —   | ✓   |
| 2   | Pad Gloves          | 3   | 2   | 0       | 28  | 20      | 0       | ✓   | —   | —   | ✓   |
| 3   | Legendary Gloves    | 44  | 11  | 0       | 42  | 20      | 0       | ✓   | —   | —   | ✓   |
| 4   | Bone Gloves         | 14  | 5   | 0       | 30  | 20      | 0       | ✓   | —   | —   | ✓   |
| 5   | Leather Gloves      | 4   | 2   | 0       | 30  | 80      | 0       | —   | ✓   | —   | ✓   |
| 6   | Scale Gloves        | 22  | 7   | 0       | 40  | 110     | 0       | —   | ✓   | —   | ✓   |
| 7   | Sphinx Gloves       | 28  | 8   | 0       | 36  | 20      | 0       | ✓   | —   | —   | ✓   |
| 8   | Brass Gloves        | 32  | 9   | 0       | 44  | 100     | 30      | —   | ✓   | —   | ✓   |
| 9   | Plate Gloves        | 42  | 12  | 0       | 50  | 130     | 0       | —   | ✓   | —   | ✓   |
| 10  | Vine Gloves         | 4   | 2   | 0       | 22  | 30      | 60      | —   | —   | ✓   | —   |
| 11  | Silk Gloves         | 14  | 4   | 0       | 26  | 30      | 70      | —   | —   | ✓   | —   |
| 12  | Wind Gloves         | 26  | 6   | 0       | 32  | 30      | 80      | —   | —   | ✓   | —   |
| 13  | Spirit Gloves       | 38  | 9   | 0       | 38  | 40      | 80      | —   | —   | ✓   | —   |
| 14  | Guardian Gloves     | 50  | 15  | 0       | 45  | 40      | 80      | —   | —   | ✓   | —   |
| 15  | Storm Crow Gloves   | 70  | 20  | 0       | 80  | 150     | 70      | —   | —   | —   | ✓   |
| 16  | Black Dragon Gloves | 76  | 22  | 0       | 74  | 170     | 60      | —   | ✓   | —   | —   |
| 17  | Dark Phoenix Gloves | 86  | 37  | 0       | 80  | 205     | 63      | —   | ★   | —   | —   |
| 18  | Grand Soul Gloves   | 70  | 20  | 0       | 67  | 49      | 10      | ★   | —   | —   | —   |
| 19  | Divine Gloves       | 72  | 29  | 0       | 74  | 50      | 110     | —   | —   | ★   | —   |
| 20  | Thunder Hawk Gloves | 88  | 34  | 0       | 82  | 150     | 70      | —   | —   | —   | ✓   |
| 21  | Great Dragon Gloves | 94  | 48  | 0       | 86  | 200     | 58      | —   | ★   | —   | —   |

---

## Group 11 — Boots

`Walk Spd` bonus increases your movement speed.

| #   | Name               | Lvl | Def | Walk Spd | Dur | Req Str | Req Agi | DW  | DK  | ELF | MG  |
| --- | ------------------ | --- | --- | -------- | --- | ------- | ------- | --- | --- | --- | --- |
| 0   | Bronze Boots       | 12  | 4   | 0        | 34  | 80      | 20      | —   | ✓   | —   | ✓   |
| 1   | Dragon Boots       | 54  | 15  | 0        | 68  | 120     | 30      | —   | ✓   | —   | ✓   |
| 2   | Pad Boots          | 4   | 3   | 0        | 28  | 20      | 0       | ✓   | —   | —   | ✓   |
| 3   | Legendary Boots    | 46  | 12  | 0        | 42  | 30      | 0       | ✓   | —   | —   | ✓   |
| 4   | Bone Boots         | 16  | 6   | 0        | 30  | 30      | 0       | ✓   | —   | —   | ✓   |
| 5   | Leather Boots      | 5   | 2   | 0        | 30  | 80      | 0       | —   | ✓   | —   | ✓   |
| 6   | Scale Boots        | 22  | 8   | 0        | 40  | 110     | 0       | —   | ✓   | —   | ✓   |
| 7   | Sphinx Boots       | 30  | 9   | 0        | 36  | 30      | 0       | ✓   | —   | —   | ✓   |
| 8   | Brass Boots        | 32  | 10  | 0        | 44  | 100     | 30      | —   | ✓   | —   | ✓   |
| 9   | Plate Boots        | 42  | 12  | 0        | 50  | 130     | 0       | —   | ✓   | —   | ✓   |
| 10  | Vine Boots         | 5   | 2   | 0        | 22  | 30      | 60      | —   | —   | ✓   | —   |
| 11  | Silk Boots         | 15  | 4   | 0        | 26  | 30      | 70      | —   | —   | ✓   | —   |
| 12  | Wind Boots         | 27  | 7   | 0        | 32  | 30      | 80      | —   | —   | ✓   | —   |
| 13  | Spirit Boots       | 40  | 10  | 0        | 38  | 40      | 80      | —   | —   | ✓   | —   |
| 14  | Guardian Boots     | 52  | 16  | 0        | 45  | 40      | 80      | —   | —   | ✓   | —   |
| 15  | Storm Crow Boots   | 72  | 22  | 0        | 80  | 150     | 70      | —   | —   | —   | ✓   |
| 16  | Black Dragon Boots | 78  | 24  | 0        | 74  | 170     | 60      | —   | ✓   | —   | —   |
| 17  | Dark Phoenix Boots | 93  | 40  | 0        | 80  | 198     | 60      | —   | ★   | —   | —   |
| 18  | Grand Soul Boots   | 76  | 22  | 0        | 67  | 59      | 10      | ★   | —   | —   | —   |
| 19  | Divine Boots       | 81  | 30  | 0        | 74  | 50      | 110     | —   | —   | ★   | —   |
| 20  | Thunder Hawk Boots | 92  | 37  | 0        | 82  | 150     | 70      | —   | —   | —   | ✓   |
| 21  | Great Dragon Boots | 98  | 50  | 0        | 86  | 200     | 58      | —   | ★   | —   | —   |

---

## Group 12 — Wings & Extras 1

### Wings

Wings require **Req Lvl** character level and provide **Defense** and **Durability**.

| #   | Name              | Lvl | Def | Dur | Req Lvl | DW  | DK  | ELF | MG  |
| --- | ----------------- | --- | --- | --- | ------- | --- | --- | --- | --- |
| 0   | Wings of Elf      | 100 | 10  | 200 | 180     | —   | —   | ✓   | —   |
| 1   | Wings of Heaven   | 100 | 10  | 200 | 180     | ✓   | —   | —   | ✓   |
| 2   | Wings of Satan    | 100 | 20  | 200 | 180     | —   | ✓   | —   | ✓   |
| 3   | Wings of Spirits  | 150 | 30  | 200 | 215     | —   | —   | ★   | —   |
| 4   | Wings of Soul     | 150 | 30  | 200 | 215     | ★   | —   | —   | —   |
| 5   | Wings of Dragon   | 150 | 45  | 200 | 215     | —   | ★   | —   | —   |
| 6   | Wings of Darkness | 150 | 40  | 200 | 215     | —   | —   | —   | ✓   |

### Skill Orbs

Orbs teach skills to characters. `Req Str / Req Agi / Req Ene` = stat requirement, `Money` = gold cost.

| #   | Name                     | Lvl | Req Lvl | Req Str | Req Ene | Money   | DW  | DK  | ELF | MG  |
| --- | ------------------------ | --- | ------- | ------- | ------- | ------- | --- | --- | --- | --- |
| 7   | Orb of Twisting Slash    | 47  | 80      | 0       | 0       | 29,000  | —   | ✓   | —   | ✓   |
| 8   | Healing Orb              | 8   | 0       | 100     | 0       | 800     | —   | —   | ✓   | —   |
| 9   | Orb of Greater Defense   | 13  | 0       | 100     | 0       | 3,000   | —   | —   | ✓   | —   |
| 10  | Orb of Greater Damage    | 18  | 0       | 100     | 0       | 7,000   | —   | —   | ✓   | —   |
| 11  | Orb of Summoning         | 3   | 0       | 0       | 0       | 150     | —   | —   | ✓   | —   |
| 12  | Orb of Rageful Blow      | 78  | 170     | 0       | 0       | 150,000 | —   | ★   | —   | —   |
| 13  | Orb of Impale            | 20  | 28      | 0       | 0       | 10,000  | —   | ✓   | —   | ✓   |
| 14  | Orb of Greater Fortitude | 60  | 120     | 0       | 0       | 43,000  | —   | ✓   | —   | —   |
| 15  | Jewel of Chaos           | 12  | 0       | 0       | 0       | 0       | ✓   | ✓   | ✓   | ✓   |
| 16  | Orb of Fire Slash        | 60  | 0       | 320     | 0       | 51,000  | —   | —   | —   | ✓   |
| 17  | Orb of Penetration       | 64  | 130     | 0       | 0       | 72,000  | —   | —   | ✓   | —   |
| 18  | Orb of Ice Arrow         | 81  | 0       | 0       | 258     | 195,000 | —   | —   | ★   | —   |
| 19  | Orb of Death Stab        | 72  | 160     | 0       | 0       | 85,000  | —   | ★   | —   | —   |

---

## Group 13 — Pets, Rings & Pendants

`Ice / Poison / Lightin / Fire` = elemental resistance bonuses.

### Pets

| #   | Name             | Lvl | Dur | DW  | DK  | ELF | MG  |
| --- | ---------------- | --- | --- | --- | --- | --- | --- |
| 0   | Guardian Angel   | 23  | ∞   | ✓   | ✓   | ✓   | ✓   |
| 1   | Imp              | 28  | ∞   | ✓   | ✓   | ✓   | ✓   |
| 2   | Horn of Uniria   | 25  | ∞   | ✓   | ✓   | ✓   | ✓   |
| 3   | Horn of Dinorant | 110 | ∞   | ✓   | ✓   | ✓   | ✓   |

> Dur = -1 means unlimited durability (∞)

### Rings

| #   | Name                | Lvl | Dur | Ice | Poison | DW  | DK  | ELF | MG  |
| --- | ------------------- | --- | --- | --- | ------ | --- | --- | --- | --- |
| 8   | Ring of Ice         | 20  | 50  | ✓   | —      | ✓   | ✓   | ✓   | ✓   |
| 9   | Ring of Poison      | 17  | 50  | —   | ✓      | ✓   | ✓   | ✓   | ✓   |
| 10  | Transformation Ring | 0   | 200 | —   | —      | ✓   | ✓   | ✓   | ✓   |

### Pendants

| #   | Name                 | Lvl | Dur | Lightning | Fire | DW  | DK  | ELF | MG  |
| --- | -------------------- | --- | --- | --------- | ---- | --- | --- | --- | --- |
| 12  | Pendant of Lightning | 21  | 50  | ✓         | —    | ✓   | ✓   | ✓   | ✓   |
| 13  | Pendant of Fire      | 13  | 50  | —         | ✓    | ✓   | ✓   | ✓   | ✓   |

### Quest / Special Items

| #   | Name                       | DW  | DK  | ELF | MG  |
| --- | -------------------------- | --- | --- | --- | --- |
| 14  | Loch's Feather             | ✓   | ✓   | ✓   | ✓   |
| 15  | Fruit                      | ✓   | ✓   | ✓   | ✓   |
| 16  | Scroll of Archangel        | ✓   | ✓   | ✓   | ✓   |
| 17  | Blood Bone                 | ✓   | ✓   | ✓   | ✓   |
| 18  | Cloak of Invisibility      | ✓   | ✓   | ✓   | ✓   |
| 19  | Divine Weapon of Archangel | ✓   | ✓   | ✓   | ✓   |

---

## Group 14 — Jewels, Consumables & Extras

`Value` = HP/MP recovery amount (potions) or 0 for non-consumables.

### Potions

| #   | Name                  | Value | Min Level |
| --- | --------------------- | ----- | --------- |
| 0   | Apple                 | 5     | 1         |
| 1   | Small Healing Potion  | 10    | 10        |
| 2   | Medium Healing Potion | 20    | 25        |
| 3   | Large Healing Potion  | 30    | 40        |
| 4   | Small Mana Potion     | 10    | 10        |
| 5   | Medium Mana Potion    | 20    | 25        |
| 6   | Large Mana Potion     | 30    | 40        |
| 8   | Antidote              | 10    | 10        |
| 9   | Ale                   | 30    | 15        |
| 10  | Town Portal Scroll    | 30    | 30        |

### Jewels & Special Items

| #   | Name                 | Notes                             |
| --- | -------------------- | --------------------------------- |
| 11  | Box of Luck          | Random reward box                 |
| 12  | Heart                | Event item                        |
| 13  | Jewel of Bless       | Upgrades item level               |
| 14  | Jewel of Soul        | Upgrades item with success chance |
| 15  | Zen                  | In-game currency                  |
| 16  | Jewel of Life        | Adds item option (Req Lvl 72)     |
| 17  | Devil's Eye          | Event component                   |
| 18  | Devil's Key          | Event component                   |
| 19  | Devil's Invitation   | Event item                        |
| 20  | Remedy of Love       | Quest item                        |
| 21  | Rena                 | Resurrection item                 |
| 22  | Jewel of Creation    | Crafting jewel (Req Lvl 78)       |
| 23  | Scroll of Emperor    | Quest scroll                      |
| 24  | Broken Sword         | Quest item                        |
| 25  | Tear of Elf          | Quest item                        |
| 26  | Soul Shard of Wizard | Quest item                        |

---

## Group 15 — Scrolls (Skill Books)

Scrolls teach spells. `Req Ene` = energy required, `Money` = purchase cost.

| #   | Name                    | Skill Lvl | Req Ene | Money   | DW  | DK  | ELF | MG  |
| --- | ----------------------- | --------- | ------- | ------- | --- | --- | --- | --- |
| 0   | Scroll of Poison        | 30        | 100     | 17,000  | ✓   | —   | —   | ✓   |
| 1   | Scroll of Meteorite     | 21        | 100     | 11,000  | ✓   | —   | —   | ✓   |
| 2   | Scroll of Lightning     | 13        | 100     | 3,000   | ✓   | —   | —   | ✓   |
| 3   | Scroll of Fire Ball     | 5         | 100     | 300     | ✓   | —   | —   | ✓   |
| 4   | Scroll of Flame         | 35        | 100     | 21,000  | ✓   | —   | —   | ✓   |
| 5   | Scroll of Teleport      | 17        | 100     | 5,000   | ✓   | —   | —   | —   |
| 6   | Scroll of Ice           | 25        | 100     | 14,000  | ✓   | —   | —   | ✓   |
| 7   | Scroll of Twister       | 40        | 100     | 25,000  | ✓   | —   | —   | ✓   |
| 8   | Scroll of Evil Spirit   | 50        | 100     | 35,000  | ✓   | —   | —   | ✓   |
| 9   | Scroll of Hellfire      | 60        | 100     | 60,000  | ✓   | —   | —   | ✓   |
| 10  | Scroll of Power Wave    | 9         | 100     | 1,150   | ✓   | —   | —   | ✓   |
| 11  | Scroll of Aqua Beam     | 74        | 110     | 100,000 | ✓   | —   | —   | ✓   |
| 12  | Scroll of Cometfall     | 80        | 150     | 175,000 | ✓   | —   | —   | ✓   |
| 13  | Scroll of Inferno       | 88        | 200     | 265,000 | ✓   | —   | —   | ✓   |
| 14  | Scroll of Teleport Ally | 83        | 188     | 245,000 | ★   | —   | —   | —   |
| 15  | Scroll of Soul Barrier  | 77        | 126     | 135,000 | ✓   | —   | —   | —   |

---

## Armor Sets Summary

Items sharing the same name prefix belong to a set (Helm + Armor + Pants + Gloves + Boots):

| Set Name     | Class  | Approx. Lvl Range     |
| ------------ | ------ | --------------------- |
| Pad          | DW     | Low (5–10)            |
| Bone         | DW     | Low-Mid (18–22)       |
| Legendary    | DW     | Mid (44–56)           |
| Bronze       | DK     | Low-Mid (12–18)       |
| Leather      | DK     | Low-Mid (6–10)        |
| Scale        | DK     | Mid (22–28)           |
| Brass        | DK     | Mid (32–38)           |
| Plate        | DK     | Mid-High (42–48)      |
| Dragon       | DK     | High (52–59)          |
| Black Dragon | DK     | Very High (76–90)     |
| Dark Phoenix | DK     | Endgame (86–100)      |
| Great Dragon | DK     | Endgame (94–126)      |
| Vine         | ELF    | Low (4–10)            |
| Silk         | ELF    | Low-Mid (14–20)       |
| Wind         | ELF    | Mid (26–32)           |
| Spirit       | ELF    | Mid-High (38–44)      |
| Guardian     | ELF    | High (50–57)          |
| Storm Crow   | ELF/MG | High (70–80)          |
| Divine       | ELF    | High (72–92)          |
| Sphinx       | DW     | Mid (28–38)           |
| Grand Soul   | DW/MG  | High (70–86)          |
| Thunder Hawk | MG     | High-Endgame (88–107) |
