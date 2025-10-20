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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeContentPadding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
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
        var userGuess by remember { mutableStateOf("") }
        var feedbackMessage by remember { mutableStateOf<String?>(null) }

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
                    feedbackMessage?.let { message ->
                        Text(
                            text = message,
                            modifier = Modifier.padding(bottom = 8.dp),
                            textAlign = TextAlign.Center,
                        )
                    }
                    when {
                        isLoading -> Text("Loading Pokemon...")
                        errorMessage != null -> Text(
                            text = errorMessage ?: "Unknown error",
                            textAlign = TextAlign.Center,
                        )
                        else -> {
                            image?.let { Image(bitmap = it, contentDescription = name) }
                            Text("Name: ${name ?: "Unknown"}")
                            Spacer(modifier = Modifier.height(16.dp))
                            OutlinedTextField(
                                value = userGuess,
                                onValueChange = { userGuess = it },
                                modifier = Modifier.fillMaxWidth(0.8f),
                                label = { Text("Tapez le nom du Pokemon") },
                                enabled = !isLoading,
                                singleLine = true,
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            Button(
                                onClick = {
                                    val expectedName = name?.trim()?.lowercase()
                                    val guessedName = userGuess.trim().lowercase()
                                    if (!expectedName.isNullOrEmpty() && guessedName == expectedName) {
                                        feedbackMessage = "Bonne reponse ! Nouveau Pokemon en cours..."
                                        userGuess = ""
                                        requestKey++
                                    } else {
                                        feedbackMessage = "C'est faux, essayez encore."
                                    }
                                },
                                enabled = !isLoading && !name.isNullOrEmpty(),
                            ) {
                                Text("Valider")
                            }
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
            if (requestKey == 1) {
                feedbackMessage = null
            }

            val result = runCatching { Greeting().fetchPokemon() }
            result.onSuccess { details ->
                name = details.name
                image = details.grayscaleImage?.let { byteArrayToImageBitmap(it) }
                feedbackMessage = "Un nouveau Pokemon est pret, devinez son nom !"
            }.onFailure { throwable ->
                errorMessage = throwable.message ?: "Failed to load Pokemon"
                feedbackMessage = null
            }

            isLoading = false
        }
    }
}
