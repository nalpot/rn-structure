import Realm from 'realm';
import '../jest/setup';

const ITEM_SCHEMA = {
    name: 'TestSchema',
    primaryKey: 'name',
    properties: {
        name: 'string',
        fragments: 'string[]',
    },
};

test('should fetch users', () => {
    const params = {schema: [ITEM_SCHEMA], schemaVersion: 1};
    const i = {
        name: 'Charlie',
        fragments: ['tes', 'OK'],
    };
    Realm.open(params).then((realm) => {
        realm.write(() => {
            realm.create('TestSchema', {
                name: 'Charlie',
                fragments: ['tes', 'OK'],
            });
        });
        let count = realm.objects('TestSchema');
        expect(count).toBe(i);

        realm.write(() => {
            for (const u of count) {
                realm.delete(u);
            }
        });

        realm.close();
    });
});
