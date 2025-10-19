package com.mastercyber.tp1.data

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.android.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import com.mastercyber.tp1.model.Pokemon

class PokemonRepository {
    private val client = HttpClient(Android) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    suspend fun fetchPokemon(id: Int): Pokemon =
        client.get("https://pokeapi.co/api/v2/pokemon/$id").body()
}
