<template>
    <div class="flex justify-center items-center gap-1 p-1">
        <!-- Noun Symbols -->
        <template v-if="card.type === 'Noun'">
            <span v-if="card.singular" class="text-xs" title="Singular">😊</span>
            <span v-if="card.plural" class="text-xs" title="Plural">👥</span>
        </template>

        <!-- Verb Symbols -->
        <template v-if="card.type === 'Verb'">
            <span v-if="hasTense('present simple')" class="w-2 h-2 rounded-full bg-white border border-black"
                title="Present"></span>
            <span v-if="hasTense('past simple')" class="w-2 h-2 rounded-full bg-black border border-white"
                title="Past"></span>
            <span v-if="hasTense('future simple')" class="text-xs" title="Future">⚙️</span>
        </template>

        <!-- Adjective/Adverb/Extra Symbols -->
        <template v-if="['Adj', 'Adverb', 'ExtraInformation'].includes(card.type)">
            <!-- Add specific symbols if available in card data -->
            <span v-if="card.condition && card.condition.includes('singular')" class="text-xs">😊</span>
            <span v-if="card.condition && card.condition.includes('plural')" class="text-xs">👥</span>
        </template>
    </div>
</template>

<script>
export default {
    name: 'card-symbols',
    props: {
        card: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const hasTense = (tense) => {
            if (!props.card.content) return false
            return props.card.content.some(c => c.tense === tense)
        }

        return {
            hasTense
        }
    }
}
</script>
