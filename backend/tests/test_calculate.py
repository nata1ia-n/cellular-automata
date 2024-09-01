import pytest
from automata.calculate import initial_generation, patterns, rule_from_patterns, next_generation, generations
from hypothesis import given
from hypothesis.strategies import integers, dictionaries


@pytest.fixture
def initial_generation_odd():
    return [0, 0, 0, 1, 0, 0, 0]

@pytest.fixture
def initial_generation_even():
    return [0, 0, 0, 0, 1, 0, 0, 0]

@pytest.fixture
def patterns_30():
    return {
        0: 0, 
        1: 1, 
        2: 1, 
        3: 1, 
        4: 1, 
        5: 0, 
        6: 0, 
        7: 0  
    }

def test_get_initial_generation_odd(initial_generation_odd: list[int]):
    generations_number = 7
    expected_initial_generation = initial_generation_odd
    assert expected_initial_generation == initial_generation(generations_number)

def test_get_initial_generation_even(initial_generation_even: list[int]):
    generations_number = 8
    expected_initial_generation = initial_generation_even
    assert expected_initial_generation == initial_generation(generations_number)

@given(generations_number=integers(min_value=1, max_value=1000))
def test_get_initial_generation_with_hypothesis(generations_number: int):
    initial_generation_list = initial_generation(generations_number)

    assert len(initial_generation_list) == generations_number
    assert initial_generation_list.count(1) == 1

    one_position = initial_generation_list.index(1)

    expected_index = generations_number // 2

    assert one_position == expected_index

    for i, bit in enumerate(initial_generation_list):
        if i != one_position:
            assert bit == 0

def test_get_patterns_with_example(patterns_30: dict[int, int]):
    rule_number = 30
    expected_patterns = patterns_30
    assert patterns(rule_number) == expected_patterns

@given(rule=integers(min_value=0, max_value=255))
def test_get_patterns_with_hypothesis(rule: int):
    result_patterns = patterns(rule)
    assert isinstance(result_patterns, dict)
    assert all(isinstance(k, int) and (0 <= k <= 7) for k in result_patterns.keys())
    assert all(isinstance(v, int) and (v == 0 or v == 1) for v in result_patterns.values())
    assert len(result_patterns) == 8

    rules_binary_string = format(rule, "08b")
    for i, value in result_patterns.items():
        assert value == int(rules_binary_string[-(i+1)])

def test_rule_from_patterns_with_example(patterns_30: dict[int, int]):
    expected_rule = 30
    assert rule_from_patterns(patterns_30) == expected_rule

@given(patterns=dictionaries(keys=integers(min_value=0, max_value=7), values=integers(min_value=0, max_value=1), min_size=8, max_size=8))
def test_rule_from_patterns_with_hypothesis(patterns: dict[int, int]):
    assert len(patterns) == 8
    assert all(k in patterns for k in range(8))
    rule_number = rule_from_patterns(patterns)
    rules_binary_string = format(rule_number, "08b")
    for i in range(8):
        assert patterns[7 - i] == int(rules_binary_string[i])


def test_calculate_next_generation_rule_30(initial_generation_odd: list[int], patterns_30: dict[int, int]):
    current_generation = initial_generation_odd
    patterns = patterns_30
    expected_next_generation = [0, 0, 1, 1, 1, 0, 0]
    assert next_generation(current_generation, patterns) == expected_next_generation

def test_calculate_generations_rule_30(initial_generation_odd: list[int], patterns_30: dict[int, int]):
    initial_pattern = initial_generation_odd
    patterns = patterns_30
    generations_number = 2
    expected_generations = [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 1, 0]
    ]
    assert generations(initial_pattern, patterns, generations_number) == expected_generations