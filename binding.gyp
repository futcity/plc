{
    "targets": [
        {
            "target_name": "board",
            "sources": [
                "src/core/board/board.cpp"
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            "dependencies": [
                "<!(node -p \"require('node-addon-api').gyp\")"
            ],
            "cflags!": ["-fno-exceptions"],
            "cflags_cc!": ["-fno-exceptions"],
            "defines": ["NAPI_CPP_EXCEPTIONS"],
            'libraries': ["-lwiringPi", "-lwiringPiDev"]
        }
    ]
}