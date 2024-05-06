from typing import List


def get_initial_generation(generations_number: int) -> List[int]:
    half = generations_number // 2
    pattern = 1 << half
    initial_generation_list = [(pattern >> i) & 1 for i in reversed(range(generations_number))]
    return initial_generation_list

def get_patterns(pattern_number: int) -> dict[int, int]:
    rules_binary_string = format(pattern_number, '08b')
    patterns = {i: int(rules_binary_string[-(i+1)]) for i in range(8)}
    return patterns

def calculate_next_generation(current_generation: List[int], patterns: dict[int, int]) -> List[int]:
    new_generation = []
    for i in range(len(current_generation)):
        left = current_generation[i - 1] if i > 0 else 0
        center = current_generation[i]
        right = current_generation[i + 1] if i < len(current_generation) - 1 else 0
        pattern = (left << 2) | (center << 1) | right # same as (left * 4) + (center * 2) + (right * 1)
        new_generation.append(patterns[pattern]) 
    return new_generation

def calculate_generations(initial_pattern: List[int], patterns: dict[int, int], generations: int) -> List[List[int]]:
    current_generation = [cell for cell in initial_pattern]
    result = [current_generation]
    for _ in range(generations):
        current_generation = calculate_next_generation(current_generation, patterns)
        result.append(current_generation)
    return result