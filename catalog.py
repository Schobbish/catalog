import argparse
import json
# artists as keys, albums are in lists or dict if more info is needed (year?)


def add():
    """Asks the user some questions to add an album to the catalog"""
    catalog = json.loads(open('catalog.json').read())
    artist = input('Artist: ')
    if artist not in catalog:
        # create new set for artist if they're not in the catalog
        catalog[artist] = {}
    album = input('Album: ')
    if album in catalog[artist]:
        print('That album is already in the catalog.')
    else:
        catalog[artist][album] = {}

    jsonCatalog = json.dumps(catalog, sort_keys=True, indent=4)
    print('Added {} by {} to the catalog.'.format(album, artist))
    open('catalog.json', 'w').write(jsonCatalog)


def delete():
    """Asks the user some questions to delete an album to the catalog"""
    catalog = json.loads(open('catalog.json').read())
    artist = input('Artist: ')
    if artist not in catalog:
        print('That artist does not exist in the catalog.')
    else:
        album = input('Album to Delete: ')
        if album not in catalog[artist]:
            print('That album does not exist in the catalog.')
        else:
            del catalog[artist][album]
            # check if the artist is empty now
            if not catalog[artist]:
                del catalog[artist]

            jsonCatalog = json.dumps(catalog, sort_keys=True, indent=4)
            print('Deleted {} by {} from the catalog.'.format(album, artist))
            open('catalog.json', 'w').write(jsonCatalog)


def search(keyword):
    print('no search function yet')


def main():
    parser = argparse.ArgumentParser(
        prog='catalog',
        description='Keeps a catalog of albums (which will be in catalog.json)'
    )
    parser.add_argument(
        'command',
        choices=['add', 'delete', 'search'],
        help='specifies the mode to use to interact with the catalog.'
    )
    args = parser.parse_args()

    if args.command == 'add':
        while True:
            add()
            yeses = ['y', 'yes', 'Y', 'Yes', 'YES']
            answer = input('Would you like to add another album? (y/n): ')
            if answer not in yeses:
                break
    elif args.command == 'delete':
        delete()
    else:
        search(input('Query: '))


if __name__ == '__main__':
    main()
