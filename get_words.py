from bs4 import BeautifulSoup
import requests
import string

baseUrl = "http://www.portaldalinguaportuguesa.org/index.php?action=syllables&act=list"

file = open('words_syllables_pt_BR.csv','w', encoding='utf-8')
file.write("word,syllabic_division\n")

for letra in string.ascii_lowercase:
    starts = 0
    while True:
        print(f"Buscando letra '{letra}' com starts = {starts}")
        response = requests.get(f'{baseUrl}&letter={letra}&start={starts}')
        data = response.content.decode('utf-8')
        soup = BeautifulSoup(data, "lxml")

        table = soup.find(id="rollovertable")
        rows = table.find_all("tr")
        if len(rows) == 1:
            break
        
        starts += 100

        for row in rows:
            cells = row.findAll("td")
            if cells:
                palavra = cells[0].find('b').find('a').getText(strip=True)
                divisaosilabica = cells[1].getText(strip=True).replace('·', '-')
                file.write(f"{palavra},{divisaosilabica}\n")
