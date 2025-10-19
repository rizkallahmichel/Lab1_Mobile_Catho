package org.example.project

import kotlinx.serialization.Serializable

@Serializable
data class PokemonName(
    val fr: String? = null,
    val en: String? = null,
    val jp: String? = null,
)
