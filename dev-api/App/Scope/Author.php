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
                    Config::post('list', Essay::class, 'multi');
                    Config::post('views', Essay::class, 'views');
                    Config::post('likes', Essay::class, 'likes');
                    Config::group(['category'], function () {
                        Config::post('list', EssayCategory::class, 'multi');
                    });
                });
            }
        );
    }
}