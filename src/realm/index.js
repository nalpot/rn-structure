import Realm from 'realm';
import {ContactLocalSchema, ContactSchema} from './Schema';

class Contact extends Realm.Object {}
Contact.schema = ContactSchema;
class ContactLocal extends Realm.Object {}
ContactLocal.schema = ContactLocalSchema;

export default new Realm({
    path: 'app.realm',
    schema: [Contact, ContactLocal],
    schemaVersion: 0,
    deleteRealmIfMigrationNeeded: true,
});
