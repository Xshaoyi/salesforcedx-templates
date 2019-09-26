/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { expect, test } from '@salesforce/command/lib/test';
import { Messages } from '@salesforce/core';
import * as path from 'path';
import * as assert from 'yeoman-assert';
// tslint:disable-next-line: no-var-requires
const fs = require('fs');
const standardfolderarray = [
  'aura',
  'applications',
  'classes',
  'contentassets',
  'flexipages',
  'layouts',
  'objects',
  'permissionsets',
  'staticresources',
  'tabs',
  'triggers'
];
const filestocopy = [
  '.forceignore',
  '.gitignore',
  '.prettierignore',
  '.prettierrc'
];
const emptyfolderarray = ['aura', 'lwc'];
const analyticsfolderarray = ['waveTemplates'];
const vscodearray = ['extensions', 'launch', 'settings'];

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('salesforcedx-templates', 'messages');

describe('Project creation tests:', () => {
  describe('Check project creation', () => {
    test
      .withOrg()
      .withProject()
      .stdout()
      .command(['force:project:create', '--projectname', 'foo'])
      .it('should create project with default values and foo name', ctx => {
        assert.file([path.join('foo', 'config', 'project-scratch-def.json')]);
        assert.file([path.join('foo', 'README.md')]);
        assert.file([path.join('foo', 'sfdx-project.json')]);
        for (const file of vscodearray) {
          assert.file([path.join('foo', '.vscode', `${file}.json`)]);
        }
        assert.fileContent(
          path.join('foo', 'README.md'),
          messages.getMessage('StandardReadMe')
        );
        assert.file([
          path.join(
            'foo',
            'force-app',
            'main',
            'default',
            'lwc',
            '.eslintrc.json'
          )
        ]);
        for (const file of filestocopy) {
          assert.file([path.join('foo', file)]);
        }
        for (const folder of standardfolderarray) {
          assert(
            fs.existsSync(
              path.join('foo', 'force-app', 'main', 'default', folder)
            )
          );
        }
      });
    test
      .withOrg()
      .withProject()
      .stdout()
      .command([
        'force:project:create',
        '--projectname',
        'foo',
        '--outputdir',
        'test outputdir'
      ])
      .it(
        'should create project with default values and foo name in a custom output directory with spaces in its name',
        ctx => {
          assert.file([
            path.join(
              'test outputdir',
              'foo',
              'config',
              'project-scratch-def.json'
            )
          ]);
          assert.file([path.join('test outputdir', 'foo', 'README.md')]);
          assert.file([
            path.join('test outputdir', 'foo', 'sfdx-project.json')
          ]);
          for (const file of vscodearray) {
            assert.file([
              path.join('test outputdir', 'foo', '.vscode', `${file}.json`)
            ]);
          }
          assert.file([
            path.join(
              'test outputdir',
              'foo',
              'force-app',
              'main',
              'default',
              'lwc',
              '.eslintrc.json'
            )
          ]);
          for (const file of filestocopy) {
            assert.file([path.join('test outputdir', 'foo', file)]);
          }
          for (const folder of standardfolderarray) {
            assert(
              fs.existsSync(
                path.join(
                  'test outputdir',
                  'foo',
                  'force-app',
                  'main',
                  'default',
                  folder
                )
              )
            );
          }
        }
      );
    test
      .withOrg()
      .withProject()
      .stdout()
      .command([
        'force:project:create',
        '--projectname',
        'footest',
        '--manifest'
      ])
      .it(
        'should create project with footest name and manifest folder',
        ctx => {
          assert.file([path.join('footest', 'manifest', 'package.xml')]);
        }
      );
    test
      .withOrg()
      .withProject()
      .stdout()
      .command([
        'force:project:create',
        '--projectname',
        'fooempty',
        '--template',
        'empty',
        '--defaultpackagedir',
        'empty',
        '--namespace',
        'testnamespace'
      ])
      .it(
        'should create project with fooempty name, empty template, empty default package directory, and a custom namespace',
        ctx => {
          assert.file(path.join('fooempty', '.forceignore'));
          assert.fileContent(
            path.join('fooempty', 'sfdx-project.json'),
            '"namespace": "testnamespace",'
          );
          assert.fileContent(
            path.join('fooempty', 'sfdx-project.json'),
            '"path": "empty",'
          );
          assert.fileContent(
            path.join('fooempty', 'sfdx-project.json'),
            'sourceApiVersion'
          );
          for (const folder of emptyfolderarray) {
            assert(
              fs.existsSync(
                path.join('fooempty', 'empty', 'main', 'default', folder)
              )
            );
          }
          assert.fileContent(
            path.join('fooempty', 'README.md'),
            '# Salesforce App'
          );
        }
      );
    test
      .withOrg()
      .withProject()
      .stdout()
      .command([
        'force:project:create',
        '--projectname',
        'analytics1',
        '--template',
        'analytics',
        '--manifest'
      ])
      .it(
        'should create project with analytics1 name using analytics template and a manifest',
        ctx => {
          assert.file(path.join('analytics1', '.forceignore'));
          assert.fileContent(
            path.join('analytics1', 'sfdx-project.json'),
            '"path": "force-app",'
          );
          assert.fileContent(
            path.join('analytics1', 'sfdx-project.json'),
            'sourceApiVersion'
          );
          for (const folder of analyticsfolderarray) {
            assert(
              fs.existsSync(
                path.join('analytics1', 'force-app', 'main', 'default', folder)
              )
            );
          }
          assert.fileContent(
            path.join('analytics1', 'config', 'project-scratch-def.json'),
            '["AnalyticsAdminPerms", "EinsteinAnalyticsPlus"]'
          );
          assert.fileContent(
            path.join('analytics1', 'manifest', 'package.xml'),
            '<name>WaveTemplateBundle</name>'
          );
          assert.fileContent(
            path.join('analytics1', 'README.md'),
            '# Salesforce App'
          );
        }
      );
  });
  describe('project creation failures', () => {
    test
      .withOrg()
      .withProject()
      .stderr()
      .command(['force:project:create'])
      .it('should throw invalid template name error', ctx => {
        expect(ctx.stderr).to.contain(
          messages.getMessage('MissingProjectname')
        );
      });
    test
      .withOrg()
      .withProject()
      .stderr()
      .command([
        'force:project:create',
        '--projectname',
        'foo',
        '--template',
        'foo'
      ])
      .it('should throw invalid template name error', ctx => {
        expect(ctx.stderr).to.contain(messages.getMessage('InvalidTemplate'));
      });
    test
      .withOrg()
      .withProject()
      .stderr()
      .command([
        'force:project:create',
        '--projectname',
        '/a',
        '--outputdir',
        'testing'
      ])
      .it('should throw invalid non alphanumeric projectname error', ctx => {
        expect(ctx.stderr).to.contain(
          messages.getMessage('AlphaNumericNameError')
        );
      });

    test
      .withOrg()
      .withProject()
      .stderr()
      .command([
        'force:project:create',
        '--projectname',
        '3aa',
        '--outputdir',
        'testing'
      ])
      .it(
        'should throw invalid projectname starting with numeric error',
        ctx => {
          expect(ctx.stderr).to.contain(
            messages.getMessage('NameMustStartWithLetterError')
          );
        }
      );

    test
      .withOrg()
      .withProject()
      .stderr()
      .command(['force:project:create', '--projectname', 'a_'])
      .it(
        'should throw invalid projectname ending with underscore error',
        ctx => {
          expect(ctx.stderr).to.contain(
            messages.getMessage('EndWithUnderscoreError')
          );
        }
      );

    test
      .withOrg()
      .withProject()
      .stderr()
      .command(['force:project:create', '--projectname', 'a__a'])
      .it(
        'should throw invalid projectname with double underscore error',
        ctx => {
          expect(ctx.stderr).to.contain(
            messages.getMessage('DoubleUnderscoreError')
          );
        }
      );
  });
});