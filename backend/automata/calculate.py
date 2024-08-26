from typing import List
import random

def initial_generation(size: int, randomize: bool = False) -> List[int]:
    if randomize:
        g = [random.choice([0,1]) for _ in range(size)]
    else:
        g = [0] * size
        g[size // 2] = 1
    return g

def patterns(pattern_number: int) -> dict[int, int]:
    rules_binary_string = format(pattern_number, '08b')
    patterns = {i: int(rules_binary_string[-(i+1)]) for i in range(8)}
    return patterns

def rule_from_patterns(patterns: dict[int, int]) -> int:
    rules_binary_string = ''.join(str(patterns[i]) for i in range(7, -1, -1))
    return int(rules_binary_string, 2)

def next_generation(current_generation: List[int], patterns: dict[int, int]) -> List[int]:
    new_generation = []
    for i in range(len(current_generation)):
        left = current_generation[i - 1] if i > 0 else 0
        center = current_generation[i]
        right = current_generation[i + 1] if i < len(current_generation) - 1 else 0
        pattern = (left << 2) | (center << 1) | right # same as (left * 4) + (center * 2) + (right * 1)
        new_generation.append(patterns[pattern]) # type: ignore
    return new_generation # type: ignore

def generations(initial_pattern: List[int], patterns: dict[int, int], generations: int) -> List[List[int]]:
    current_generation = [cell for cell in initial_pattern]
    result = [current_generation]
    for _ in range(generations):
        current_generation = next_generation(current_generation, patterns)
        result.append(current_generation)
    return result