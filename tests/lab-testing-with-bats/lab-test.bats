#!/usr/bin/env bash

load 'test_helper/bats-support/load'
load 'test_helper/bats-assert/load'

@test "hello-world.sh prints Hello" {
  run scripts/hello-world.sh
  assert_success
  assert_output --partial "Hello"
}
