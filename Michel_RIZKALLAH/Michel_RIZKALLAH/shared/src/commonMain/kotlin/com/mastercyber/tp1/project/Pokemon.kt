package org.example.project

import kotlinx.serialization.Serializable

@Serializable
data class Pokemon(
    val pokedex_id: String? = null,
    val category: String? = null,
    val name: PokemonName? = null,
    val sprites: Sprites? = null,
)
