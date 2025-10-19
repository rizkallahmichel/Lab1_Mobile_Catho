package org.example.project

import androidx.compose.ui.graphics.ImageBitmap

expect fun convertToGrayScale(imageBytes: ByteArray): ByteArray

expect fun byteArrayToImageBitmap(imageBytes: ByteArray): ImageBitmap?
