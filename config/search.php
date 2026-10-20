<?php

return [
    'language' => env('SEARCH_LANGUAGE', 'indonesian'),

    'stopwords' => [
        'jam',
        'tangan',
        'watch',
        'watches',
        'mewah',
        'luxury',
        'premium',
        'yang',
        'dan',
        'untuk',
        'dengan',
        'di',
        'ke',
        'dari',
        'ini',
        'itu',
        'saya',
        'cari',
        'mencari',
        'koleksi',
    ],

    'synonyms' => [
        'pria' => ['pria', 'laki', 'laki-laki', 'male', 'men'],
        'wanita' => ['wanita', 'perempuan', 'female', 'women'],
        'vintage' => ['vintage', 'klasik', 'classic'],
        'otomatis' => ['otomatis', 'automatic', 'auto'],
        'baterai' => ['baterai', 'quartz'],
        'sport' => ['sport', 'olahraga', 'diver'],
        'formal' => ['formal', 'dress'],
    ],
];
