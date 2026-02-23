/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { suite, test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert";
import { coordination } from "../../../../src/sca/coordination.js";
import * as shellActions from "../../../../src/sca/actions/shell/shell-actions.js";

suite("Shell Actions", () => {
  let originalWindow: typeof globalThis.window;

  beforeEach(() => {
    coordination.reset();
    originalWindow = globalThis.window;
  });

  afterEach(() => {
    globalThis.window = originalWindow;
    coordination.reset();
  });

  suite("updatePageTitle", () => {
    test("sets page title with graph title when present", async () => {
      const setTitle = mock.fn();

      shellActions.bind({
        services: {
          shellHost: { setTitle },
        } as never,
        controller: {
          editor: {
            graph: {
              title: "My Test Board",
            },
          },
        } as never,
      });

      await shellActions.updatePageTitle();

      // Verify shellHost.setTitle was called with the graph title and the tag
      assert.strictEqual(setTitle.mock.calls.length, 1);
      assert.strictEqual(
        setTitle.mock.calls[0].arguments[0],
        "My Test Board - APP_NAME [Experiment]"
      );
    });

    test("sets default title when graph title is empty", async () => {
      const setTitle = mock.fn();

      shellActions.bind({
        services: {
          shellHost: { setTitle },
        } as never,
        controller: {
          editor: {
            graph: {
              title: "",
            },
          },
        } as never,
      });

      await shellActions.updatePageTitle();

      // Verify shellHost.setTitle was called with just the tag
      assert.strictEqual(setTitle.mock.calls.length, 1);
      assert.strictEqual(
        setTitle.mock.calls[0].arguments[0],
        "APP_NAME [Experiment]"
      );
    });

    test("trims whitespace from graph title", async () => {
      const setTitle = mock.fn();

      shellActions.bind({
        services: {
          shellHost: { setTitle },
        } as never,
        controller: {
          editor: {
            graph: {
              title: "  Whitespace Board  ",
            },
          },
        } as never,
      });

      await shellActions.updatePageTitle();

      // Verify shellHost.setTitle was called with the trimmed title and the tag
      assert.strictEqual(setTitle.mock.calls.length, 1);
      assert.strictEqual(
        setTitle.mock.calls[0].arguments[0],
        "Whitespace Board - APP_NAME [Experiment]"
      );
    });
  });
});
