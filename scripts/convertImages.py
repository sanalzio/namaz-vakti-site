from os import system as e

icon_resulations = [
    57,
    48,
    72,
    96,
    128,
    144,
    192,
    255
]

splash_resulations = [
    [640, 1136],
    [750, 1334],
    [320, 460],
    [640, 920],
    [768, 1004],
    [748, 1024],
    [1536, 2008],
    [2048, 1496],
    [1242, 2208]
]

for i in icon_resulations:
    res = str(i) + "x" + str(i)
    e(f'convert -background transparent -size {res} "../src/assets/icons/svg/icon.svg" "../src/assets/icons/png/{res}.png"')
    e(f'convert -background transparent -size {res} "../src/assets/icons/svg/icon-light.svg" "../src/assets/icons/png/{res}-light.png"')

for i in splash_resulations:
    res = str(i[0]) + "x" + str(i[1])
    e(f'convert -background transparent -size {res} "../src/assets/splash/svg/{res}.svg" "../src/assets/splash/png/{res}.png"')
    e(f'convert -background transparent -size {res} "../src/assets/splash/svg/{res}-light.svg" "../src/assets/splash/png/{res}-light.png"')