package org.example.project

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Paint
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import java.io.ByteArrayOutputStream

actual fun convertToGrayScale(imageBytes: ByteArray): ByteArray {
    val original = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size) ?: return imageBytes
    val grayscaleBitmap = Bitmap.createBitmap(original.width, original.height, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(grayscaleBitmap)
    val paint = Paint()
    val colorMatrix = ColorMatrix().apply { setSaturation(0f) }
    paint.colorFilter = ColorMatrixColorFilter(colorMatrix)
    canvas.drawBitmap(original, 0f, 0f, paint)

    return ByteArrayOutputStream().use { stream ->
        grayscaleBitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
        val result = stream.toByteArray()
        original.recycle()
        grayscaleBitmap.recycle()
        result
    }
}

actual fun byteArrayToImageBitmap(imageBytes: ByteArray): ImageBitmap? {
    return BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)?.asImageBitmap()
}
