// © 2024 - https://github.com/zeppeliino/Shop-Bot-NodeJS-Puppeteer/ //

const puppeteer = require('puppeteer');
const fs = require('fs');

const excludedNames = ['GesperrterName1', 'GesperrterName2']; // Für größere Projekte kannst du damit Namen ausschließen.
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function processNames(names) {
    if (!names || names.length === 0) {
        console.log('Fehler: Keine Namen übermittelt');
        return;
    }

    console.log("Verarbeitete Namen:", names);

    for (const name of names) {
        const lowerCaseName = name.toLowerCase();

        if (excludedNames.includes(lowerCaseName)) {
            console.log(`Name ${name} wird übersprungen, da er in der Ausschlussliste steht.`);
            await delay(10000); // Wartet und lässt den Nutzer denken, sein Name wird bearbeitet (nur sinnvoll, wenn server.js als Backend läuft, mit einer Oberfläche davor).
            continue;
        }

        let attempts = 0;
        let success = false;
        let browser;

        while (attempts < 2 && !success) {
            try {
                browser = await puppeteer.launch({ headless: false });
                const page = await browser.newPage();
                await page.goto('LINK'); // Link zu der Seite, wo der Bot starten soll - z.B. in der Kategorie T-Shirts
                await delay(2000);

                const buttonExists = await page.$('BUTTON ID'); // Hier die ID des Buttons von dem Produkt das Du in den Warenkorb legen möchtest - Diese ID findest Du mit F12 im Browser
                if (buttonExists) {
                    await page.click('BUTTON ID', { force: true });
                } else {
                    console.log("Button nicht gefunden, versuche Fallback");
                }

                await delay(1000);
                await page.goto('LINK'); // Wenn alle Produkte im Warenkorb liegen hier den Link zur Kasse einfügen, so sparst Du dir unnötige Zeilen Code um den Warenkorb anzuklicken z.B. https://meinStore.de/kasse
                await delay(1000);

                await page.waitForSelector('EINGABE NAME ID', { timeout: 5000 }); // Hier machst fügst Du die ID des Eingabefelds für deinen Namen ein (die namen.txt) - Die ID findest Du wieder mit F12
                await page.type('EINGABE NAME ID', name);

                await page.type('EINGABE E-MAIL', 'DEINE E-MAIL ADRESSE'); // "EINGABE E-MAIL" ist die ID des Eingabefelds, in das Deine E-Mail eingetragen werden muss. Anstatt "DEINE E-MAIL ADRESSE" gibst Du nun deine E-Mail Adresse an die beim Einkaufen verwendet werden soll
                await delay(500);

                await page.click('CHECKBOX ID'); // Wenn der Shop voraussetzt z.B. die AGB`s zu akzeptieren kannst Du hier die ID der Checkboxen eintragen 
                await delay(500);
                await page.click('CHECKBOX ID');
                await delay(500);

                const isVisible = await page.evaluate(() => {
                    const button = document.querySelector('KAUFEN BUTTON'); // "KAUFEN BUTTON" wird Durch die ID des Buttons ersetzt mit dem man die Bestellung abschickt
                    return button && button.offsetWidth > 0 && button.offsetHeight > 0;
                });

                console.log('Button sichtbar:', isVisible);

                if (isVisible) {
                    await page.click('KAUFEN BUTTON', { force: true });
                } else {
                    console.log('Button nicht sichtbar');
                }

                await delay(7000); // Verzögerung nach dem Kauf bevor das Fenster geschlossen wird. 1000 = 1 Sekunde
                await browser.close();

                success = true;
                console.log(`Name ${name} erfolgreich verarbeitet.`); // Feedback in der Konsole
            } catch (error) {
                console.error(`Fehler beim Verarbeiten des Namens ${name}:`, error);
                attempts++;
                if (attempts >= 2) {
                    console.log(`Name ${name} nach ${attempts} Versuchen übersprungen.`);
                } else {
                    console.log(`Neuer Versuch für ${name}, Versuch: ${attempts}`); // Wenn Chrome abstürzt oder ein Fehler auftritt, probiert er es erneut                      
                }
            } finally {
                if (browser) await browser.close();
            }
        }
    }

    console.log('Alles ausgeführt');
}

// Lese die Datei namen.txt und rufe processNames auf
fs.readFile('namen.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Fehler beim Lesen der Datei:', err);
        return;
    }
    
    // Teile den Inhalt der Datei in ein Array von Namen auf und filtere leere Zeilen heraus
    const names = data.split('\n').map(name => name.trim()).filter(name => name);
    processNames(names);
});
