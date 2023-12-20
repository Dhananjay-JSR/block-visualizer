# import requests
# from bs4 import BeautifulSoup
# import re
# from urllib.parse import urlparse
# import os


# HTML_Link = requests.get("https://the-eye.eu/redarcs/")
# soup = BeautifulSoup(HTML_Link.content, "html.parser")


# regex_string = re.compile(r'crypto', re.IGNORECASE)

# matching_tr_elements = []
# DOwnloadLinks = []

# # Find all <tr> elements
# tr_elements = soup.find_all('tr')

# # Iterate over <tr> elements
# for tr_element in tr_elements:
#     # Find all <a> elements within the current <tr>
#     a_elements = tr_element.find_all('a', href=True)

#     # Check if any <a> element's text matches the regex
#     if any(regex_string.search(a_element.get_text()) for a_element in a_elements):
#         matching_tr_elements.append(tr_element)
# matching_href_list = []
# # Print the matching <td> elements
# for tr_element in matching_tr_elements:
#     for index,td_element in enumerate(tr_element.find_all('td')):
#         if index ==2:
#             a_elements = td_element.find('a', href=True)
#             # print(a_elements.attrs['href'])
#             DOwnloadLinks.append(a_elements.attrs['href'])

# for CommentsHrefUrl  in DOwnloadLinks:
#     parsed_url = urlparse(CommentsHrefUrl)

#     # Extract the filename from the path
#     filename = os.path.basename(parsed_url.path)
#     r = requests.get(CommentsHrefUrl)
#     with open(str(filename), 'wb') as f:
#         f.write(r.content)


import requests
from bs4 import BeautifulSoup
req = requests.get('https://cryptscam.com/en')
soup = BeautifulSoup(req.content, 'html.parser')
liItems = soup.find_all("li",{
    "class": "page-item"
})

LastItemValue = (liItems[len(liItems)-2].find('a').get_text())

GLobalList = []

def Extractor(pageNumber:int):
        
    StringGen = "https://cryptscam.com/en?page="+str(pageNumber)

    req = requests.get(StringGen)

    soup = BeautifulSoup(req.content, 'html.parser')

    ReportsBox = soup.find_all("div",{
        "class":"card my-3"
    })

    Reports = []

    for report in ReportsBox:
        WAddress = report.find("div",{"class":"col-md-10 font-size-1 font-weight-bold"}).get_text()
        MoreDetails = report.find_all("div",{
            "class": "col-md-10 my-1"
        })
        tempStore = dict()
        tempStore['WAddress'] = WAddress.strip()
        tempStore['dateAdded'] = MoreDetails[0].get_text().strip()
        tempStore['typeOfScam'] = MoreDetails[1].get_text().strip()
        tempStore['scammerAddress'] = MoreDetails[2].get_text().strip()
        tempStore['country'] = MoreDetails[3].get_text().strip()
        tempStore['description'] = MoreDetails[4].get_text().strip()
        tempStore['source'] = MoreDetails[5].get_text().strip()
        tempStore['site_url'] = MoreDetails[6].get_text().strip()
        Reports.append(tempStore)
    return Reports

for n in range(1, int(LastItemValue)+1):
    GLobalList = GLobalList + Extractor(n)

import json
with open('data.json', 'w') as outfile:
    json.dump(GLobalList, outfile)