import type { Device, DeviceKind, PartKind } from "./devices"

/**
 * Repair guides. Written in house from our own bench process — deliberately
 * not adapted from anyone else's published guides.
 *
 * A guide matches devices by brand, family or kind rather than listing every
 * model, so adding a device to the roster gives it guides automatically.
 */

export type Difficulty = "Easy" | "Moderate" | "Difficult"

export type GuideStep = {
  title: string
  body: string
  /** Rendered as a highlighted caution box under the step. */
  warning?: string
}

export type Guide = {
  slug: string
  title: string
  summary: string
  difficulty: Difficulty
  time: string
  partKind: PartKind
  /** Product ids of the tools this job needs. */
  toolIds: string[]
  match: {
    brands?: string[]
    families?: string[]
    kind?: DeviceKind
    /** Only devices with this panel type, where it changes the procedure. */
    panel?: "oled" | "lcd"
  }
  steps: GuideStep[]
  aftercare: string[]
}

const SCREEN_TOOLS = [
  "screen-fix-kit",
  "heat-pad",
  "suction-handle",
  "opening-pick-set",
  "adhesive-strips",
]
const BATTERY_TOOLS = [
  "battery-fix-kit",
  "precision-driver-24",
  "isopropyl-wipes",
  "esd-wrist-strap",
]
const BOARD_TOOLS = ["essential-repair-toolkit", "metal-spudger", "esd-wrist-strap"]

export const guides: Guide[] = [
  {
    slug: "iphone-screen-replacement",
    title: "Replacing an iPhone screen",
    summary:
      "Full display assembly swap on an iPhone 11 through 16. The assembly comes with the frame and brackets fitted, so this is mostly a careful disassembly job rather than a fiddly transfer.",
    difficulty: "Moderate",
    time: "45 – 60 minutes",
    partKind: "screen",
    toolIds: SCREEN_TOOLS,
    match: { brands: ["Apple"], kind: "phone" },
    steps: [
      {
        title: "Power down and discharge below 25%",
        body: "Shut the phone down properly rather than letting it sleep. A lithium cell at low charge is far less energetic if you nick it, and you are about to work millimetres from one.",
        warning:
          "Never work on a phone that is plugged in, and never puncture or fold a battery. A damaged cell can vent and catch fire minutes later.",
      },
      {
        title: "Remove the two pentalobe screws",
        body: "They sit either side of the charge port on the bottom edge. They are shorter than the internal screws, so keep them separate — a magnetic mat or a labelled tray saves you a stripped thread later.",
      },
      {
        title: "Warm the lower edge and lift",
        body: "Bring the bottom edge to about 80°C with a heat pad for two minutes. Set the suction handle just above the home edge, pull steady rather than sharp, and slide an opening pick into the gap the moment one opens.",
        warning:
          "Work the pick along the sides only. The display cables run along the top edge on every model from the iPhone 11 onward — cutting through them turns a screen repair into a board repair.",
      },
      {
        title: "Swing the display open like a book",
        body: "Once the adhesive has released on three sides, rotate the display away from the left edge and rest it against something. Do not let it hang on its cables.",
      },
      {
        title: "Disconnect the battery first, then the display",
        body: "Unscrew the battery connector bracket and lift the connector straight up before touching anything else. Then remove the display bracket and disconnect the display and digitiser flexes.",
        warning:
          "Battery first, always. Disconnecting a live display flex is the most common way people kill a backlight circuit.",
      },
      {
        title: "Transfer the earpiece mesh if your part needs it",
        body: "Most of our assemblies ship with it fitted. If yours does not, the mesh lifts out with tweezers and presses into the new frame — leaving it off means muffled calls and dust ingress.",
      },
      {
        title: "Fit the new assembly and test before sealing",
        body: "Connect the display, refit the brackets, reconnect the battery, and power on. Check touch across all four corners, brightness, True Tone, Face ID and the earpiece before you commit to adhesive.",
      },
      {
        title: "Re-adhere and reassemble",
        body: "Peel the old adhesive off the frame with tweezers, clean the channel with isopropyl, lay the fresh strips, and press the display home for thirty seconds. Refit the pentalobes last.",
      },
    ],
    aftercare: [
      "Expect True Tone to survive on our assemblies — if it disappears, the display data has not transferred and we can reprogram it in store.",
      "Leave the phone off the charger for the first hour so the adhesive cures.",
      "If the proximity sensor misbehaves on calls, the sensor flex is seated slightly proud — reopen and reseat rather than pressing harder.",
    ],
  },
  {
    slug: "iphone-battery-replacement",
    title: "Replacing an iPhone battery",
    summary:
      "The single highest-value repair you can do yourself. A phone whose battery health has dropped below 80% behaves like a much older phone, and a fresh cell fixes it for under forty pounds.",
    difficulty: "Moderate",
    time: "30 – 45 minutes",
    partKind: "battery",
    toolIds: BATTERY_TOOLS,
    match: { brands: ["Apple"], kind: "phone" },
    steps: [
      {
        title: "Check it is actually the battery",
        body: "Settings, Battery, Battery Health. Below 80% capacity, or a peak-performance message, means the cell. A phone that shuts down at 40% in the cold is also the cell. Anything else, get it diagnosed first.",
      },
      {
        title: "Open the phone as for a screen repair",
        body: "Two pentalobes, heat the lower edge, suction and pick along the sides, swing the display open from the left. Do not lift the display straight up.",
      },
      {
        title: "Disconnect the battery, then the display",
        body: "Battery connector bracket off, connector up, then the display brackets and flexes. Set the display aside somewhere it cannot be knocked.",
      },
      {
        title: "Pull the adhesive tabs slowly",
        body: "There are two or four black tabs at the base of the cell. Pull each one flat along the phone at a steady, slow rate — think thirty seconds per strip. They stretch to several times their length before releasing.",
        warning:
          "If a tab snaps, stop pulling. Do not lever the cell out with anything metal or rigid. Apply a few drops of adhesive remover round the edges, wait a minute, and work it free with a plastic card.",
      },
      {
        title: "Seat the new cell and connect it",
        body: "Lay the fresh adhesive, drop the cell in without pressing it down yet, and connect the battery flex. Check it is fully home — a partially seated battery connector causes intermittent shutdowns that look like a faulty cell.",
      },
      {
        title: "Test, then press down and reassemble",
        body: "Power on, confirm it charges and that the health reading appears. Then press the cell firmly for thirty seconds, refit the display, and seal with fresh display adhesive.",
      },
    ],
    aftercare: [
      "iOS will show a service message on non-Apple cells on some models. Capacity and cycle count still report correctly, and the phone is not throttled.",
      "Run it down to about 15% and back to full once to let the gauge calibrate.",
      "Battery health on a new cell should read 100% within a charge cycle or two. If it reads below 95% from the start, tell us — that is not normal and we will replace it.",
    ],
  },
  {
    slug: "iphone-charging-port-replacement",
    title: "Replacing an iPhone charging port",
    summary:
      "For a phone that charges only at one angle, drops the connection when nudged, or has stopped charging entirely. Usually the port flex rather than anything on the board.",
    difficulty: "Difficult",
    time: "60 – 90 minutes",
    partKind: "charging",
    toolIds: BOARD_TOOLS,
    match: { brands: ["Apple"], kind: "phone" },
    steps: [
      {
        title: "Clean the port before you order anything",
        body: "Power off, then work compacted lint out with a wooden toothpick and finish with a dry brush. A genuinely surprising number of dead-charging phones are just full of pocket fluff, and this costs nothing to rule out.",
        warning:
          "Nothing metal in the port, and nothing wet. You are millimetres from live contacts.",
      },
      {
        title: "Open the phone and remove the battery",
        body: "As for a battery replacement. The port flex runs underneath the cell on most models, so the battery has to come out rather than just be disconnected.",
      },
      {
        title: "Remove the Taptic Engine and speaker",
        body: "Both sit over the lower assembly. Keep their screws grouped by location — they differ in length by fractions of a millimetre and the wrong one in the wrong hole will bite into the board.",
      },
      {
        title: "Release the flex along its whole run",
        body: "The port flex is adhered along the chassis and tucks under brackets on its way to the board. Warm it gently and lift with a plastic spudger, following the run rather than pulling on the port itself.",
        warning:
          "On iPhone 11 and later the flex passes very close to the wireless charging coil. Tearing that is an expensive extra part.",
      },
      {
        title: "Fit the new flex and dress it correctly",
        body: "Seat the port squarely in its cutout first, then lay the flex along the same path the old one took. If the port sits proud, a cable will not click in when the phone is reassembled.",
      },
      {
        title: "Test with a cable before closing up",
        body: "Reconnect the battery and display and try a real cable and charger. Confirm charging, then check the microphone on a voice memo and the bottom speaker — both share this assembly on most models.",
      },
    ],
    aftercare: [
      "If the phone charges but the bottom microphone is dead, the flex is not fully seated at the board connector.",
      "Slow charging after the repair usually means a poor connector seat rather than a bad part.",
      "This is the repair we most often see brought back in half-finished. If it goes wrong, bring it to us — a partial teardown is not a problem, and we will not charge a diagnostic.",
    ],
  },
  {
    slug: "iphone-back-glass-replacement",
    title: "Replacing iPhone back glass",
    summary:
      "Worth doing at home from the iPhone 14 onward, where the rear panel is designed to come off. On the iPhone 12 and 13 the glass is laminated to the chassis and this becomes a laser job — bring those in.",
    difficulty: "Difficult",
    time: "60 – 90 minutes",
    partKind: "back-glass",
    toolIds: ["essential-repair-toolkit", "heat-pad", "opening-pick-set", "adhesive-strips"],
    match: { brands: ["Apple"], kind: "phone" },
    steps: [
      {
        title: "Confirm your model opens from the back",
        body: "iPhone 14, 14 Plus, 15, 15 Plus, 16 and 16 Plus have a removable rear panel. The Pro models and everything from the 12 and 13 generations do not — on those the glass is bonded and has to be burned off with a laser.",
      },
      {
        title: "Remove the pentalobes and open from the back",
        body: "On a back-opening model the rear panel lifts after the two bottom screws and a heat-and-pick pass round the edge, exactly like a display but on the other side.",
      },
      {
        title: "Disconnect the battery and the rear camera",
        body: "Battery first. The rear camera module and the flash flex both connect through this side and need releasing before the panel will come away.",
      },
      {
        title: "Transfer the wireless charging coil",
        body: "The coil and its flex are attached to the rear panel. It unscrews and lifts as a unit — new panels do not usually include it, so this has to move across.",
        warning:
          "Do not crease the coil flex. A kink in it means wireless charging works intermittently or heats up.",
      },
      {
        title: "Fit the new panel and reassemble",
        body: "Lay fresh perimeter adhesive, refit the coil, reconnect the camera and battery, and test wireless charging and the rear cameras before pressing the panel home.",
      },
    ],
    aftercare: [
      "Water resistance is reduced after any rear panel repair. Treat the phone as splash-resistant only from here.",
      "If wireless charging stops working, the coil flex is not fully seated — that is the first thing to check.",
    ],
  },
  {
    slug: "galaxy-screen-replacement",
    title: "Replacing a Samsung Galaxy screen",
    summary:
      "On modern Galaxy phones the panel is bonded to the mid-frame, so the sane repair is a full service-pack assembly. Longer than an iPhone screen, but less delicate once you are in.",
    difficulty: "Difficult",
    time: "75 – 90 minutes",
    partKind: "screen",
    toolIds: SCREEN_TOOLS,
    match: { brands: ["Samsung"], kind: "phone" },
    steps: [
      {
        title: "Understand what you are buying",
        body: "A bare Galaxy panel has to be separated from the old frame and re-laminated, which needs equipment most people do not have. A service-pack assembly arrives bonded to a new frame and turns this into a transfer job.",
      },
      {
        title: "Heat and remove the rear glass",
        body: "Galaxy phones open from the back. Warm the rear panel evenly to around 80°C, work a pick under a corner, and run it round the perimeter. Take your time — the rear glass is brittle and will crack if you lever.",
      },
      {
        title: "Remove the wireless charging coil and mid-frame screws",
        body: "The coil assembly lifts out as a unit. Under it is a ring of Phillips screws holding the mid-frame — there are a lot of them and they are all the same length, which is a rare mercy.",
      },
      {
        title: "Disconnect the battery, then everything else",
        body: "Battery connector first. Then the display flex, the fingerprint reader flex, and the sub-board ribbon.",
        warning:
          "The under-display fingerprint reader is matched to the panel. Transfer it with the new assembly if your part includes one, and expect to re-enrol fingerprints either way.",
      },
      {
        title: "Move the board and battery into the new assembly",
        body: "Rather than fitting a screen to the phone, you are moving the phone into a new screen-and-frame. Work through mainboard, battery, cameras, sub-board, buttons, in that order.",
      },
      {
        title: "Test fully, then seal the rear glass",
        body: "Power on and check the display, touch, fingerprint enrolment, both speakers and charging before laying new rear adhesive.",
      },
    ],
    aftercare: [
      "Re-enrol every fingerprint after the repair — old enrolments were matched to the old sensor.",
      "IP68 rating does not survive a rear-glass reseal at home. Assume splash resistance only.",
      "If the display shows a green tint or flicker at low brightness, the panel is faulty rather than misfitted. Send it back to us.",
    ],
  },
  {
    slug: "galaxy-battery-replacement",
    title: "Replacing a Samsung Galaxy battery",
    summary:
      "Straightforward once the rear glass is off, which is the hard part. Budget most of your time for getting in and out rather than for the cell itself.",
    difficulty: "Moderate",
    time: "45 – 60 minutes",
    partKind: "battery",
    toolIds: BATTERY_TOOLS,
    match: { brands: ["Samsung"], kind: "phone" },
    steps: [
      {
        title: "Open the rear glass with heat and patience",
        body: "Even heat to about 80°C, pick in at a corner, run the perimeter. If it is fighting you, it is not warm enough — force cracks the glass.",
      },
      {
        title: "Lift the wireless charging coil",
        body: "Unscrew and disconnect it. It will fold out of the way on its flex; do not crease it.",
      },
      {
        title: "Disconnect the battery flex",
        body: "Lift the connector straight up with a plastic spudger before doing anything else.",
      },
      {
        title: "Release the cell with adhesive remover",
        body: "Galaxy batteries are stuck down over their whole face and most have no pull tabs. Run adhesive remover round the edges, give it two or three minutes, then work a plastic card under one corner and lift evenly.",
        warning:
          "No metal tools under the cell, and never bend it. If it will not shift, add more remover and wait — do not force it.",
      },
      {
        title: "Fit the new cell, test, and reseal",
        body: "Fresh adhesive, cell down, connect, power on, confirm it charges. Then refit the coil and lay new rear adhesive.",
      },
    ],
    aftercare: [
      "Samsung phones do not report battery health natively — use a diagnostic app if you want to see the new cell's capacity.",
      "Run one full cycle to let the gauge settle.",
    ],
  },
  {
    slug: "galaxy-charging-port-replacement",
    title: "Replacing a Samsung charging port board",
    summary:
      "The easiest board-level repair on any modern phone. On most Galaxy models the USB-C port lives on its own sub-board that unplugs — no soldering.",
    difficulty: "Moderate",
    time: "40 – 60 minutes",
    partKind: "charging",
    toolIds: BOARD_TOOLS,
    match: { brands: ["Samsung"], kind: "phone" },
    steps: [
      {
        title: "Clean the port first",
        body: "Powered off, lift compacted lint out with a wooden toothpick. This fixes it often enough to be worth the two minutes.",
      },
      {
        title: "Open the rear and disconnect the battery",
        body: "Heat, pick, coil out, battery connector up.",
      },
      {
        title: "Remove the sub-board",
        body: "Two or three Phillips screws and one ribbon to the mainboard. The whole port, its microphone and the SIM contacts usually come away as one piece.",
      },
      {
        title: "Fit the replacement and test",
        body: "Seat the new sub-board squarely, connect the ribbon, reconnect the battery, and try a real cable. Check the bottom microphone and SIM detection too, since they ride on the same board.",
      },
    ],
    aftercare: [
      "No SIM detected after the repair means the sub-board ribbon is not fully seated.",
      "If charging is slower than before, check the port is sitting flush in its cutout.",
    ],
  },
  {
    slug: "pixel-screen-replacement",
    title: "Replacing a Google Pixel screen",
    summary:
      "Pixels open from the front, and the complication is the under-display fingerprint reader — it is matched to the panel, so the part you buy has to include it.",
    difficulty: "Difficult",
    time: "60 – 90 minutes",
    partKind: "screen",
    toolIds: SCREEN_TOOLS,
    match: { brands: ["Google"], kind: "phone" },
    steps: [
      {
        title: "Buy the assembly with the sensor fitted",
        body: "A Pixel display with no fingerprint reader, or with a mismatched one, will not enrol prints after fitting. Our Pixel assemblies ship with a matched reader — check any other supplier's does too.",
      },
      {
        title: "Heat the perimeter and lift the display",
        body: "Warm evenly to about 80°C. Suction handle at the bottom edge, pick into the gap, work round the sides and top. Pixel adhesive is generous — expect this to take a few passes.",
      },
      {
        title: "Disconnect the battery before the display",
        body: "The battery connector is under a bracket near the mainboard. Off, up, then release the display and fingerprint flexes.",
      },
      {
        title: "Fit the new assembly and test",
        body: "Connect display and sensor, reconnect the battery, power on. Enrol a fingerprint straight away — if it will not enrol, the sensor is not matched and going further wastes your adhesive.",
        warning:
          "Do not lay adhesive until a fingerprint has successfully enrolled. That is the one failure you cannot fix without opening the phone again.",
      },
      {
        title: "Seal and reassemble",
        body: "Clean the channel, lay fresh strips, press home for thirty seconds.",
      },
    ],
    aftercare: [
      "Re-enrol all fingerprints; old enrolments are tied to the old sensor.",
      "Pixel screens can show a brief flicker on the first boot after a swap. If it persists past a restart, the flex is not seated.",
    ],
  },
  {
    slug: "pixel-battery-replacement",
    title: "Replacing a Google Pixel battery",
    summary:
      "Pixel battery complaints are very often blamed on a software update when the cell is genuinely worn. If a Pixel 6 or 7 is dying by mid-afternoon, this is usually the fix.",
    difficulty: "Moderate",
    time: "45 minutes",
    partKind: "battery",
    toolIds: BATTERY_TOOLS,
    match: { brands: ["Google"], kind: "phone" },
    steps: [
      {
        title: "Open from the front and disconnect the battery",
        body: "Heat the perimeter, lift the display with suction and picks, then take the battery connector off under its bracket.",
      },
      {
        title: "Release the cell",
        body: "Some Pixel generations have pull tabs, some are fully adhered. If there are tabs, pull slow and flat. If not, use adhesive remover and a plastic card from one corner.",
        warning: "Never lever a Pixel cell out with metal — they are thin and puncture easily.",
      },
      {
        title: "Fit, test and reseal",
        body: "Fresh adhesive, connect, power on, confirm charging. Then reseal the display with new perimeter strips.",
      },
    ],
    aftercare: [
      "Give the adaptive battery a week to relearn your usage before judging the runtime.",
      "One full discharge and recharge helps the gauge calibrate.",
    ],
  },
  {
    slug: "ipad-glass-replacement",
    title: "Replacing iPad glass and digitiser",
    summary:
      "On most iPads the glass breaks while the LCD behind it survives, so the cheaper glass-only repair is usually the right one. It is also the most patience-dependent job we do.",
    difficulty: "Difficult",
    time: "90 – 120 minutes",
    partKind: "screen",
    toolIds: SCREEN_TOOLS,
    match: { brands: ["Apple"], kind: "tablet" },
    steps: [
      {
        title: "Tape the broken glass before you start",
        body: "Cover the whole front with packing tape. It holds the shards together as you lift and keeps glass out of your hands and off the bench.",
        warning:
          "Wear eye protection. Cracked tablet glass throws splinters when it flexes.",
      },
      {
        title: "Heat one edge at a time",
        body: "iPads have a very large adhesive perimeter. Warm one edge for two to three minutes, get a pick in, and hold the gap with an opening pick before moving along. Work round in stages rather than trying to do it in one pass.",
      },
      {
        title: "Watch for the digitiser flex on the left",
        body: "It runs from the glass into the body near the volume buttons. Leave that edge until last and cut nothing there.",
      },
      {
        title: "Disconnect the battery, then the digitiser and LCD",
        body: "The battery connector is under a metal shield. Off first, then the digitiser and display flexes.",
      },
      {
        title: "Clear every trace of old adhesive",
        body: "Scrape the channel and finish with isopropyl. New glass will not sit flat on old adhesive, and a raised edge is where the next crack starts.",
      },
      {
        title: "Test before adhering",
        body: "Connect the new digitiser, reconnect the battery, power on and check touch across the whole surface — especially the corners and along the home edge.",
      },
      {
        title: "Adhere and clamp",
        body: "Lay the pre-cut adhesive, seat the glass, then weight the whole panel evenly and leave it for at least an hour.",
      },
    ],
    aftercare: [
      "Give the adhesive a full hour under weight before using the tablet, and a day before putting it in a bag.",
      "Ghost touches after the repair almost always mean the digitiser flex is pinched under the frame.",
    ],
  },
  {
    slug: "ipad-battery-replacement",
    title: "Replacing an iPad battery",
    summary:
      "A big cell held down with a lot of adhesive. Mechanically simple, but it needs adhesive remover and real patience rather than force.",
    difficulty: "Difficult",
    time: "90 minutes",
    partKind: "battery",
    toolIds: ["battery-fix-kit", "heat-pad", "isopropyl-wipes", "metal-spudger"],
    match: { brands: ["Apple"], kind: "tablet" },
    steps: [
      {
        title: "Open the tablet as for a glass repair",
        body: "Same heat-and-pick perimeter process. Tape the front first even if the glass is intact.",
      },
      {
        title: "Disconnect the battery and lift the logic board where needed",
        body: "On several iPad generations part of the board sits over the cell and has to be freed before the battery will come out.",
      },
      {
        title: "Work adhesive remover under the cell",
        body: "Apply along each edge, wait several minutes, and lift with plastic cards from two corners at once. Repeat rather than escalating to force.",
        warning:
          "An iPad cell is large, thin and easy to fold. A folded cell is a fire risk — if it creases, stop and bring it to us for safe disposal.",
      },
      {
        title: "Fit, test and reseal",
        body: "New adhesive, cell down, connect, power on, confirm charging. Then reseal the front panel and weight it for an hour.",
      },
    ],
    aftercare: [
      "Charge to full before first use so the gauge reads correctly.",
      "We take old cells for recycling free of charge, whether or not you bought the part from us.",
    ],
  },
  {
    slug: "budget-android-screen-replacement",
    title: "Replacing a screen on a budget Android",
    summary:
      "Redmi, Moto G and similar. Parts are aftermarket rather than service-pack, which is the right trade at this price — but expect more variation between suppliers than on a flagship.",
    difficulty: "Moderate",
    time: "45 – 60 minutes",
    partKind: "screen",
    toolIds: SCREEN_TOOLS,
    match: { brands: ["Xiaomi", "Motorola"], kind: "phone" },
    steps: [
      {
        title: "Check the repair is worth the phone",
        body: "Be honest about the maths. If the screen costs a third of what the handset is worth, it is still usually worth doing — if it costs most of the handset's value, it is not, and we will tell you so.",
      },
      {
        title: "Open from the back",
        body: "Most phones in this class open rear-first. Heat, pick, and lift the plastic or glass back panel.",
      },
      {
        title: "Disconnect the battery and remove the mid-frame",
        body: "Battery connector first, then the shield plate over the board and the display flex beneath it.",
      },
      {
        title: "Swap the display assembly",
        body: "These usually ship as a panel bonded to a frame, so the board and battery move across into the new frame.",
      },
      {
        title: "Test everything before sealing",
        body: "Touch, brightness, both cameras, earpiece, speaker and charging. Aftermarket panels vary, and it is much better to find a bad one now.",
      },
    ],
    aftercare: [
      "Colours may read slightly cooler than the original panel. That is normal on aftermarket parts and is not a fault.",
      "If touch is unresponsive along one edge, the flex is pinched under the frame.",
    ],
  },
  {
    slug: "nothing-rear-panel-replacement",
    title: "Replacing a Nothing Phone rear panel",
    summary:
      "The transparent back is the whole point of the phone, and it is also the part people crack. The Glyph LEDs sit behind it and need care on the way through.",
    difficulty: "Moderate",
    time: "45 – 60 minutes",
    partKind: "back-glass",
    toolIds: ["essential-repair-toolkit", "heat-pad", "opening-pick-set", "adhesive-strips"],
    match: { brands: ["Nothing"], kind: "phone" },
    steps: [
      {
        title: "Heat and lift the rear glass",
        body: "Even heat to about 80°C, pick in at a corner, run the perimeter slowly. The panel is glass and will crack further if levered cold.",
      },
      {
        title: "Disconnect the battery, then the Glyph flex",
        body: "Battery first. The Glyph LED array connects on its own flex — release it rather than pulling the panel away with it attached.",
        warning:
          "The Glyph flex is thin and its connector is small. Lift it straight up with a plastic spudger, never at an angle.",
      },
      {
        title: "Transfer the wireless coil and fit the new panel",
        body: "Move the coil across, lay fresh perimeter adhesive, seat the new panel.",
      },
      {
        title: "Test the Glyph pattern before sealing",
        body: "Reconnect and run through the Glyph settings so every segment lights. A dead segment now is a five-minute fix; after sealing it is another teardown.",
      },
    ],
    aftercare: [
      "Water resistance is reduced after a rear panel reseal.",
      "Partially dead Glyph segments usually mean the flex is not fully seated rather than a failed LED strip.",
    ],
  },
  {
    slug: "identify-your-model",
    title: "Working out exactly which model you have",
    summary:
      "Ordering the wrong part is the commonest mistake, and the difference between an iPhone 13 and a 13 Pro assembly is not visible at a glance. Two minutes here saves a return.",
    difficulty: "Easy",
    time: "2 minutes",
    partKind: "screen",
    toolIds: [],
    match: {},
    steps: [
      {
        title: "On iPhone: Settings, General, About",
        body: "The Model Name line gives you the marketing name outright on iOS 16 and later. The Model Number below it (an A-number like A2633) is the definitive answer if the name is missing.",
      },
      {
        title: "On Android: Settings, About phone",
        body: "Look for Model or Model number. Samsung uses SM- codes, so an SM-S911B is a Galaxy S23 — search the code if the friendly name is not shown.",
      },
      {
        title: "If it will not power on",
        body: "Check the regulatory print on the rear housing or in the SIM tray channel, or read the A-number or SM- code from the original box.",
      },
      {
        title: "Still not sure?",
        body: "Bring it in. We will identify it and check the fault for free, whether or not you buy the part from us.",
      },
    ],
    aftercare: [
      "Write the model number somewhere before you start a repair — you will want it again when ordering adhesive.",
    ],
  },
]

export const guideBySlug = new Map(guides.map((g) => [g.slug, g]))

/** Guides that apply to a given device. */
export function guidesForDevice(device: Device): Guide[] {
  return guides.filter((guide) => {
    const { brands, families, kind, panel } = guide.match
    if (brands && !brands.includes(device.brand)) return false
    if (families && !families.includes(device.family)) return false
    if (kind && kind !== device.kind) return false
    if (panel && panel !== device.panel) return false
    // A guide with no constraints at all applies everywhere.
    return true
  })
}

/** Devices a guide covers, for the "applies to" list on a guide page. */
export function devicesForGuide(guide: Guide, all: Device[]): Device[] {
  return all.filter((d) => guidesForDevice(d).some((g) => g.slug === guide.slug))
}

export const difficultyTone = {
  Easy: "green",
  Moderate: "amber",
  Difficult: "red",
} as const
