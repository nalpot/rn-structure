export const ContactSchema = {
    name: 'Contact',
    primaryKey: 'username',
    properties: {
        username: 'string',
        id: 'int',
        nama: 'string',
        alamat: 'string?',
        kecamatan: 'string?',
        kota: 'string?',
        propinsi: 'string?',
        produk: 'string?',
        tipe: 'string?',
        status: 'string?',
        created: 'date',
        saved: {type: 'bool', default: false},
        selected: {type: 'bool', default: false},
    },
};

export const ContactLocalSchema = {
    name: 'Local',
    primaryKey: 'number',
    properties: {
        name: 'string',
        number: 'string',
    },
};
