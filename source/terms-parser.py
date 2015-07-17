import json

def parseProgrammingTerms(filename, outFile):
    with open (filename) as f:
        termsList = []
        content = f.readlines()
        for index, line in enumerate(content):
            if len(content[index]) < 35 and content[index][0] != (' ' or '\n' or ' \n'):
                if len(line.rstrip()) != 0:
                    termsList.append(line.rstrip());

        f.close() 
    with open (outFile, 'w') as w:
        json.dump(termsList, w);


parseProgrammingTerms('./programmingTerms', './terms.json')
