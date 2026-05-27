import { readFileSync, writeFileSync } from 'fs';
const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-neerlandes.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";
const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);
let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) {}
const batch = {
  "37": "<p>Op uw kaart correspondeert dit met nummer <mark>26</mark>.</p>",
  "38": "<p>Bevindt u zich al op het punt aangegeven met nummer <mark>27</mark> op uw kaart? Uitstekend!</p>",
  "39": "<p>Op uw kaart correspondeert dit met nummer <mark>27</mark>.</p>\n<p>Druk op pauze en ga naar het <strong>Paleis van Justitie</strong> om het in zijn geheel te bewonderen.</p>",
  "40": "<p>Op uw kaart correspondeert dit met nummer <mark>28</mark>.</p>",
  "40-B": "<p>Deze ruimte correspondeert op uw kaart met nummer <mark>28</mark>.</p>",
  "41": "<p>Op uw kaart correspondeert dit met nummer <mark>29</mark>.</p>",
  "42": "<p>Op uw kaart correspondeert dit met nummer <mark>30</mark>.</p>",
  "43": "<p>Het Paleis van de Markies van Dos Aguas correspondeert op uw kaart met nummer <mark>31</mark>.</p>",
  "43-B": "<p>Op uw kaart correspondeert dit met nummer <mark>31</mark>.</p>",
  "44": "<p>Op uw kaart correspondeert dit met nummer <mark>32</mark>.</p>",
  "44-B": "<p>Ga naar de Romaanse ingang van de Kathedraal, die op uw kaart correspondeert met nummer <mark>32</mark>; let onderweg omhoog en naar links.</p>\n<p>Een achthoekige toren uit het einde van de 15e eeuw steekt uit achter de kathedraal.</p>",
  "45": "<p>Uw avontuur gaat verder met het gebouw dat op uw kaart overeenkomt met nummer <mark>33</mark>.</p>",
  "45-B": "<p>Terwijl u de oudste deur van de <strong>Kathedraal van Valencia</strong> bewondert, richt uw aandacht naar de noordkant.</p>\n<p>U kunt deze in al zijn glorie bewonderen vanuit het Plaza de la Almoina rechts van u.</p>\n<p>Ga naar het midden van het plein. Op uw kaart correspondeert dit met nummer <mark>33</mark>.</p>",
  "45-C": "<p>Uw avontuur gaat verder op dit zelfde punt, dat op uw kaart overeenkomt met nummer <mark>33</mark>.</p>",
  "45-D": "<p>Ga naar het midden van het plein dat uw kaart aangeeft als nummer <mark>33</mark>; van daaruit is een deel van de koepel van de basiliek zichtbaar, met een diameter van bijna 19 meter en een ovale grondvorm.</p>",
  "45-E": "<p>Op uw kaart correspondeert dit met nummer <mark>33</mark>.</p>",
  "45-F": "<p>Op uw kaart correspondeert dit met nummer <mark>33</mark>.</p>",
  "46": "<p>Op uw kaart correspondeert dit met nummer <mark>34</mark>.</p>",
  "46-B": "<p>Op uw kaart correspondeert dit met nummer <mark>34</mark>.</p>",
  "47": "<p>Op uw kaart correspondeert dit met nummer <mark>35</mark>.</p>",
  "47-B": "<p>Op uw kaart correspondeert dit met nummer <mark>35</mark>. Dit is uw laatste halte.</p>",
  "48": "<p>Op uw kaart correspondeert dit met nummer <mark>39</mark>.</p>",
  "48-B": "<p>Met de Toren van Santa Catalina voor u, kijk, als u zo vriendelijk wilt zijn, naar uw rechterhand.</p>\n<p>Richt uw aandacht op de achtergrond van het plein; uw volgende doel is de beroemde <strong>Miguelete</strong> die uitsteekt boven de Kathedraal.</p>\n<p>Dit slanke uitkijkpunt correspondeert op uw kaart met nummer <mark>39</mark>. Kunt u het zien?</p>",
  "49": "<p>Volg het tracé van uw kaart dat u aangeeft de Kathedraal te omronden met de gevel aan uw linkerhand.</p>\n<p>Anders gezegd, met de barokke ingang van de kathedraal voor u, sla rechtsaf en ga door tot de romaanse ingang van het heiligdom.</p>\n<p>Op uw kaart correspondeert dit met nummer <mark>40</mark>.</p>\n<p>Druk op pauze, ga of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "49-B": "<p>Richt uw aandacht opnieuw op de <strong>Kathedraal van Valencia</strong>, nummer <mark>40</mark> op uw kaart.</p>",
  "50": "<p>Op uw kaart correspondeert dit met nummer <mark>41</mark>.</p>",
  "51": "<p>Ga naar het midden van het plein dat uw kaart aangeeft als nummer <mark>42</mark>; van daaruit is een deel van de koepel van de Basiliek zichtbaar, met een breedte van bijna 19 meter en een ovale grondvorm.</p>",
  "51-B": "<p>Uw avontuur gaat verder op dit zelfde punt, dat op uw kaart overeenkomt met nummer <mark>42</mark>.</p>",
  "51-C": "<p>Ga naar het midden van het plein dat uw kaart aangeeft als nummer <mark>4</mark>; van daaruit is een deel van de koepel van de Basiliek zichtbaar, met een breedte van bijna 19 meter en een ovale grondvorm.</p>",
  "51-D": "<p>Op uw kaart correspondeert dit met nummer <mark>42</mark>.</p>",
  "52": "<p>Loop door de straat en als u de verleiding nog niet hebt bezweken, let dan op het imposante gebouw dat links van u oprijst, aangegeven op uw kaart met nummer <mark>2</mark>.</p>\n<p>Dit gebouw heet <strong>Les Corts Valencianes</strong>.</p>\n<p>Een gebouw in laat-gotische stijl, tegenwoordig bestemd voor gouvernementele activiteiten, dat vroeger de woning van de Borjia was tijdens hun verblijf in Valencia.</p>",
  "53": "<p>Bevindt u zich op het <strong>Plaza del Tossal</strong>? Ja? Uitstekend! Op uw kaart correspondeert dit met nummer <mark>49</mark>.</p>",
  "54": `<p>Als u er bent tijdens de openingsuren, beveelt ${LOGO} u aan op pauze te drukken, deze RUIMTE te betreden en van de tentoonstellingen te genieten. U kunt uw avontuur hervatten wanneer u dat geschikt acht.</p>`,
  "54-B": `<p>Als u er bent tijdens de openingsuren, beveelt ${LOGO} u aan op pauze te drukken en deze ruimte te betreden om van de tentoonstellingen te genieten. U kunt uw avontuur hervatten wanneer u dat geschikt acht.</p>`,
  "55": `<p>${LOGO} nodigt u uit deze audiogids te pauzeren en beveelt aan om op uw eigen tempo door deze tuin te wandelen.</p>`,
  "56": `<p>Als u er bent tijdens de openingsuren, nodigt ${LOGO} u uit deze audiogids te pauzeren en beveelt aan om op uw eigen tempo door deze tuin te wandelen.</p>`,
  "57": "<p>Gebruik de pauzeknop naar wens. Wanneer u voelt dat het juiste moment is gekomen, ga dan gewoon verder met het oplossen van onze uitdagingen terwijl u de stad ontdekt.</p>",
  "58": "<p>Gebruik de pauze- en doorgaan-knoppen naar wens om uw avontuur <i>op zoek naar de schat</i> te onderbreken en te hervatten, waar en wanneer u maar wilt. U kunt naar uw Avontuur terugkeren wanneer u voelt dat het juiste moment is gekomen, door gewoon op de doorgaan-knop te drukken.</p>",
  "59": "<p>Op uw kaart correspondeert dit met nummer <mark>43</mark>.</p>",
  "60": "<p>Terwijl u de gotische ingang van de Kathedraal bewondert, rijst uw volgende doel op aan de andere kant van het plein.</p>\n<p>Draai u om en u ziet voor u een paleis gebouwd in breuksteen dat zich onderscheidt van de rest van het stedelijk landschap.</p>\n<p>Zet deze audiogids niet op pauze en ga, zoals uw kaart aangeeft, naar uw volgende bezienswaardigheidspunt.</p>\n<p>Op uw kaart correspondeert dit met nummer <mark>44</mark>.</p>",
  "61": `<p>${LOGO} beveelt u aan een korte pauze te nemen en om u heen te kijken.</p>`,
  "62": `<p>${LOGO} beveelt u aan een korte pauze te nemen en om u heen te kijken.</p>`,
  "63": "<p>Op uw kaart correspondeert dit met nummer <mark>47</mark>.</p>",
  "64": `<p>Als u er bent tijdens de openingsuren, adviseert ${LOGO} u op pauze te drukken en dit cultureel centrum op uw eigen tempo te bezoeken.</p>`,
  "64-B": `<p>Als u er bent tijdens de openingsuren, adviseert ${LOGO} u op pauze te drukken en dit cultureel centrum op uw eigen tempo te bezoeken.</p>`,
  "65": "<p>Op uw kaart correspondeert dit met nummer <mark>49</mark>.</p>",
  "66": "<p>Op uw kaart correspondeert dit met nummer <mark>50</mark>.</p>",
};
const merged = { ...existing, ...batch };
const lines = esKeys.filter(k => merged[k] !== undefined).map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';
writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
