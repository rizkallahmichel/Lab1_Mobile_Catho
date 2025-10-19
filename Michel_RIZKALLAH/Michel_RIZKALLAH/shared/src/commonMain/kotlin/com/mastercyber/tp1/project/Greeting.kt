package org.example.project

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import kotlin.random.Random

private fun createHttpClient() = HttpClient {
    install(ContentNegotiation) {
        json(
            Json {
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true
            },
        )
    }
}

data class PokemonDetails(
    val name: String,
    val grayscaleImage: ByteArray?,
)

class Greeting {
    suspend fun fetchPokemon(): PokemonDetails {
        val client = createHttpClient()
        return try {
            val randomId = Random.nextInt(from = 1, until = 1026)
            val pokemon = client
                .get("https://tyradex.vercel.app/api/v1/pokemon/$randomId")
                .body<Pokemon>()

            val name = pokemon.name?.fr ?: "Unknown"
            val spriteBytes = pokemon.sprites?.regular?.let { spriteUrl ->
                runCatching { client.get(spriteUrl).body<ByteArray>() }.getOrNull()
            }

            val grayscaleImage = spriteBytes?.let { bytes ->
                runCatching { convertToGrayScale(bytes) }.getOrNull()
            }

            PokemonDetails(name = name, grayscaleImage = grayscaleImage)
        } finally {
            client.close()
        }
    }
}
