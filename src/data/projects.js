// Screenshots go in public/images/projects/ and are referenced as
// { src: '/images/projects/<file>', alt: '<what the image shows>' }.
// `details` is a list of short points shown under the summary; leave it empty if there is nothing more to say.
export const projects = [
  {
    id: 'school-bell',
    title: 'Web-controlled school bell',
    summary:
      'A school bell system (still in development): every classroom gets its own bell device, and one website manages them all.',
    tags: ['Microcontrollers', 'Electronics', 'Web'],
    image: null,
    links: [{ label: 'GitHub', href: 'https://github.com/leonid-livshyts/School-bell-project' }],
    details: [
      'Each device rings at the start and end of every lesson, plays voice announcements and alarm sounds, and reports the temperature, humidity and air quality in the room.',
      'An ESP32 running MicroPython syncs its clock and the day’s schedule from the server and shows the time and connection status on an OLED display.',
      'Sound is split across two chips: the ESP32 streams MP3 bytes over SPI to a Raspberry Pi Pico, which decodes them in C++ and drives an I2S DAC using PIO and DMA.',
      'Backend in FastAPI and SQLAlchemy, a small asyncio TCP server that streams audio files, and an admin site in React, TypeScript and Tailwind. Schematic and PCB in KiCad.',
    ],
  },
  {
    id: 'robot-sumo',
    title: 'Autonomous robot-sumo car',
    summary: 'A car built for a robot-sumo championship that finds its opponent on its own and pushes it out of the ring.',
    tags: ['Robotics', 'Microcontrollers'],
    image: null,
    links: [
      { label: 'GitHub: V1', href: 'https://github.com/leonid-livshyts/SUMO_car_V1' },
      { label: 'GitHub: V2', href: 'https://github.com/leonid-livshyts/SUMO_car_V2' },
    ],
    details: [
      'The car turns until a distance sensor sees an opponent close enough, then drives at it. Four black-line sensors spot the edge of the ring, and the car backs away from it.',
      'Four 12 V motors on two L298N drivers, a distance sensor on each side to find the opponent faster, and three 18650 cells.',
      'V1 ran MicroPython on an ESP8266. V2 moved to an ESP32 with asynchronous code and a plywood case put together with 3 mm screws and nuts.',
    ],
  },
  {
    id: 'grid-checker',
    title: 'Power-outage Telegram bot',
    summary: 'A small box that watches the mains power and sends a Telegram message when it goes off or comes back.',
    tags: ['Microcontrollers', 'Electronics', 'Software'],
    image: {
      src: '/images/projects/grid-checker-circuit.png',
      alt: 'Circuit diagram: an ESP32 reads three 230 V inputs through PC817 optocouplers and S8050 transistors',
    },
    links: [{ label: 'GitHub', href: 'https://github.com/leonid-livshyts/Grid-checker-on-telegram-bot' }],
    details: [
      'An ESP32 running MicroPython reads three 230 V lines (grid, inverter and home) through PC817 optocouplers, so the microcontroller stays isolated from the mains.',
      'Whenever a line changes state, the device posts it to a FastAPI server, which messages everyone who has started the Telegram bot. Users are saved in a database.',
      'The server runs in Docker. The wall-mounted case with a door was designed in FreeCAD and 3D printed.',
    ],
  },
  {
    id: 'freecad-tools',
    title: 'FreeCAD part generators',
    summary: 'FreeCAD macros that build a ball bearing, a screw and a nut from the sizes you type in.',
    tags: ['Design', 'Software'],
    image: {
      src: '/images/projects/freecad-screws.png',
      alt: 'Generated screws in FreeCAD with hex, pan, round, truss and countersunk heads',
    },
    links: [{ label: 'GitHub', href: 'https://github.com/leonid-livshyts/freecad_tools' }],
    details: [
      'Each tool is a single Python macro with a dialog that previews the derived sizes as you type and refuses values that cannot be built.',
      'Screws have a modelled ISO metric thread, seven head shapes and four drive types (slot, Phillips, hex socket or none).',
      'Nuts come as hex, wing, nylon-insert lock and closed-end lug styles. A nut and a screw of the same size share a thread phase, so they fit together without lining them up by hand.',
      'Covered by tests and can also be run from a script without the GUI.',
    ],
  },
  {
    id: 'wire-measure-machine',
    title: 'Wire length measuring machine',
    summary:
      'A machine (in development) that measures how much wire passes through it and winds a coil of an exact length.',
    tags: ['Electronics', 'Microcontrollers', 'Design'],
    image: {
      src: '/images/projects/wire-machine.png',
      alt: 'FreeCAD model of the machine: a base plate with gears, rollers and a winding reel',
    },
    links: [{ label: 'GitHub', href: 'https://github.com/leonid-livshyts/Wire_lenght_measure_machine' }],
    details: [
      'A motor pulls the wire over a roller that is geared to an encoder, which counts the length that has gone through.',
      'Controlled by an RP2350B. A display and a second encoder are used to set the coil length and calibrate the mechanism.',
      'A small motor driver controls the speed so the machine slows down and stops smoothly. Runs on a 12 V, 2 A supply.',
      'The mechanics are modelled in FreeCAD and the schematic is drawn in KiCad.',
    ],
  },
  {
    id: 'profile-site',
    title: 'This website',
    summary: 'My portfolio site, where I collect my projects and certificates.',
    tags: ['Web'],
    image: null,
    links: [{ label: 'GitHub', href: 'https://github.com/leonid-livshyts/Profile_site' }],
    details: [
      'Built with React 19 and Vite. Every page is generated from plain data files, so adding a project or a certificate means adding one entry.',
    ],
  },
  {
    id: 'circuit-simulator',
    title: 'Circuit diagram simulator',
    summary: 'A simulator for simple circuit diagrams.',
    tags: ['Software', 'Electronics'],
    image: null,
    links: [],
    details: [],
  },
  {
    id: 'mind-map-board',
    title: 'Mind map board',
    summary: 'Designed a mind map board.',
    tags: ['Design'],
    image: null,
    links: [],
    details: [],
  },
]
