<?php

namespace App\Scope;

use App\Scope\Author\Stat;
use App\Scope\Author\Essay;
use App\Scope\Author\EssayCategory;
use Yonna\QuickStart\Middleware\Logging;
use Yonna\QuickStart\Middleware\Limiter;
use Yonna\Scope\Config;

class Author
{

    public static function stat(): void
    {
        Config::middleware([Logging::class, Limiter::class],
            function () {
                Config::group(['author', 'stat'], function () {
                    Config::post('essay', Stat::class, 'essay');
                    Config::post('essayCategory', Stat::class, 'essayCategory');
                    Config::post('essayGrow', Stat::class, 'essayGrow');
                });
            }
        );
    }

    public static function essay(): void
    {
        Config::middleware([Logging::class, Limiter::class],
            function () {
                Config::group(['author', 'essay'], function () {
                    Config::post('info', Essay::class, 'one');
                    Config::post('page', Essay::class, 'page');
                    Config::post('add', Essay::class, 'insert');
                    Config::post('edit', Essay::class, 'update');
                    Config::post('del', Essay::class, 'delete');
                    Config::post('mDel', Essay::class, 'multiDelete');
                    Config::post('excellent', Essay::class, 'excellent');
                    Config::post('top', Essay::class, 'top');
                    Config::post('hide', Essay::class, 'hide');
                    Config::post('show', Essay::class, 'show');
                    Config::group(['category'], function () {
                        Config::post('add', EssayCategory::class, 'insert');
                        Config::post('edit', EssayCategory::class, 'update');
                        Config::post('del', EssayCategory::class, 'delete');
                        Config::post('mDel', EssayCategory::class, 'multiDelete');
                        Config::post('info', EssayCategory::class, 'one');
                        Config::post('list', EssayCategory::class, 'multi');
                        Config::post('page', EssayCategory::class, 'page');
                        Config::post('hide', EssayCategory::class, 'hide');
                        Config::post('show', EssayCategory::class, 'show');
                    });
                });
            }
        );
    }
}