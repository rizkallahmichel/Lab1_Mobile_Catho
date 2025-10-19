package org.example.project

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.safeContentPadding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import org.jetbrains.compose.ui.tooling.preview.Preview

@Composable
@Preview
fun App() {
    MaterialTheme {
        var hasRequested by remember { mutableStateOf(false) }
        var requestKey by remember { mutableStateOf(0) }
        var name by remember { mutableStateOf<String?>(null) }
        var image by remember { mutableStateOf<ImageBitmap?>(null) }
        var isLoading by remember { mutableStateOf(false) }
        var errorMessage by remember { mutableStateOf<String?>(null) }

        Column(
            modifier = Modifier
                .background(MaterialTheme.colorScheme.primaryContainer)
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Button(
                onClick = {
                    hasRequested = true
                    requestKey++
                },
                enabled = !isLoading,
            ) {
                Text("Fetch Pokemon Name")
            }
            Spacer(modifier = Modifier.height(24.dp))
            AnimatedVisibility(hasRequested) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    when {
                        isLoading -> Text("Loading Pokemon...")
                        errorMessage != null -> Text(
                            text = errorMessage ?: "Unknown error",
                            textAlign = TextAlign.Center,
                        )
                        else -> {
                            image?.let { Image(bitmap = it, contentDescription = name) }
                            Text("Name: ${name ?: "Unknown"}")
                        }
                    }
                }
            }
        }

        LaunchedEffect(requestKey) {
            if (requestKey == 0) return@LaunchedEffect
            isLoading = true
            errorMessage = null
            name = null
            image = null

            val result = runCatching { Greeting().fetchPokemon() }
            result.onSuccess { details ->
                name = details.name
                image = details.grayscaleImage?.let { byteArrayToImageBitmap(it) }
            }.onFailure { throwable ->
                    errorMessage = throwable.message ?: "Failed to load Pokemon"
            }

            isLoading = false
        }
    }
}
